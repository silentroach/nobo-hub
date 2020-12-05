# Nobø Hub

API version 1.1 for communication between a client and a Nobø Hub.

[Unusable documentation source](https://www.glendimplex.se/media/15650/nobo-hub-api-v-1-1-integration-for-advanced-users.pdf)

Version 4, 26.3.2018

- [Nobø Hub](#nobø-hub)
  - [Disclaimer](#disclaimer)
  - [Introduction](#introduction)
  - [Automatic update and synchronization](#automatic-update-and-synchronization)
  - [General network requirements](#general-network-requirements)
  - [Local network traffic - general rules](#local-network-traffic---general-rules)
  - [Auto discovery of hubs](#auto-discovery-of-hubs)
  - [Handshake](#handshake)
  - [Command set compatibility](#command-set-compatibility)
  - [Command set](#command-set)
  - [Reset function](#reset-function)
- [Command set](#command-set-1)
  - [Data structures](#data-structures)
    - [Hub](#hub)
    - [Zone](#zone)
    - [Component](#component)
    - [WeekProfile](#weekprofile)
    - [Override](#override)
  - [Commands](#commands)
    - [Add](#add)
      - [A00 – Add zone](#a00--add-zone)

## Disclaimer

This document is published to be intended as a courtesy to our users that would like themselves to integrate Nobø Hub with other smart home solutions.

By making use of the information in this document, you agree to the following:

**NO WARRANTIES**: All of the information provided in this document is provided "AS-IS" and with NO WARRANTIES. No express or implied warranties of any type, including for example implied warranties of merchantability or fitness for a particular purpose, are made with respect to the information, or any use of the information, in this document. Glen Dimplex Nordic AS makes no representations and extends no warranties of any type as to the accuracy or completeness of any information or content in this document.

**DISCLAIMER OF LIABILITY**: Glen Dimplex Nordic AS specifically DISCLAIMS LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES and assumes no responsibility or liability for any loss or damage suffered by any person as a result of the use or misuse of any of the information or content in this document. Glen Dimplex Nordic AS assumes or undertakes NO LIABILITY for any loss or damage suffered as a result of the use, misuse or reliance on the information and content in this document.

**If you publish your integration with Nobø Hub / Nobø Energy Control, you must make explicitly clear that the system/service/software is not officially supported or endorsed by Glen Dimplex Nordic AS, and that you are not an official partner of Glen Dimplex Nordic as, unless you have a signed formal agreement with Glen Dimplex Nordic AS.**

## Introduction

This document describes version 1.1 of the API for communication between Nobø Hub (also known as Nobø ecoHUB) and clients.

This document describes how a client can communicate with a Nobø Hub. This API is used today for all communication between Nobø Hub and the Nobø Energy Control app for Android and iOS.

Nobø Hub can also be controlled via the Internet, by wrapping the API described in this document in encryption and extra headers, and sending traffic via a cloud service. Communication via the Internet is not described further in this document.

Glen Dimplex Nordic reserves the right to modify the API in non-backwards compatible ways, but we will avoid this if we can, and inform our official partners as soon as possible if we do.

## Automatic update and synchronization

- The Nobø Hub has an automatic firmware update function. It checks approximately every hour with Glen Dimplex Nordic's update server.
- If several clients are connected simultaneously, the Hub always pushes any changes to all connected clients, to keep them synchronized.
- The Hub always pushes any changes to all connected clients, also if the change is not
  initiated by a connected client. Examples include an Override that has expired, or an updated temperature value from a Nobø Switch. There is no need to do continuous polling as long as the client has an open network connection to the Hub that is being kept alive.

For more details of the Hub and Nobø Energy Control system functions, please see our [online user guide](http://help.nobo.no).

## General network requirements

In general, the system will work fine if the Nobø Hub is connected via a network cable to a wireless network router with default settings for home use.

Most routers have an included DHCP server enabled (which is a requirement). Also, most routers have no firewall between the wired LAN ports on the router and the wireless connections (which is also a requirement).

Please note that routers that have only one Ethernet-connection usually will not work, because this network port (often referred to as a WAN/Internet port) usually is intended for connecting the router to the Internet and not to internal network equipment such as Nobø Hub. There usually is a firewall between the wireless network and the WAN/Internet port on such routers.

Network requirement details for special network setups (usually only found in office buildings, advanced home network setups etc.):

- The wireless network (which is connected to the APP) must be on the same local area network (LAN) as the wired network (which is connected to the HUB). If this is not the case, the following traffic must be allowed between the wired and wireless networks:
  - TCP traffic must be allowed both ways on port `27779` for the app to talk to the hub.
  - For the APP to discover the HUB automatically, the network must allow UDP
    broadcast on port 10000 and/or UDP multicast on port `10001`. If this is not possible or desirable, the HUB can be given a static IP-address from the router/DHCP server (via DHCP Reservation), and then connected via the "advanced" option in the APP setup wizard.
- HTTP TCP traffic on port `80` (standard HTTP port) must be allowed directly from the hub to the Internet, for the automatic update function to work. Nobø Hub's update function does not (so far) work with Web Proxy Servers.
- The hub requires a DHCP server on the network (this is usually implemented in the network router) to automatically get an IP address assigned.
- The network must allow Nobø Hub outgoing TCP traffic on port `27778` to be controlled via the Internet. Nobø Hub can be controlled via the Internet by wrapping the API described in this document in encryption and extra headers, and sending traffic via a server. Communication via the Internet is not described further in this document

## Local network traffic - general rules

1. Network traffic is sent as plain text.
2. All commands sent to/from the Hub must end with a carriage return (ASCII char 13).
3. All strings are UTF-8 encoded.
4. All spaces in names (e.g. the name of a Zone) must be replaced with a different character when sent via the network to the Hub. Use UTF-8 non-breaking space: Replace bytes 32 (ASCII & UTF-8 space) with the two bytes 194 and 160 (UTF-8 non-breaking space).
5. All LAN traffic uses TCP port 27779, except for auto discovery of hubs (described in the next chapter).
6. After a successful "handshake", the Hub will keep the connection alive as long as there is some network traffic at least every 30 seconds. After 30 seconds without activity, the connection is closed, and a new handshake must be performed. To keep a connection alive, a separate "KEEPALIVE" (followed by carriage return) command can be sent to the Hub. We recommend sending a keepalive request once every 14 seconds as long as you want to remain connected.
7. Please do not cache information stored on the Hub between sessions. This means that if you perform a new handshake, you also need to download all information from the Hub again (with the G00 command).
8. Two devices can be connected directly via LAN to one Hub at the same time. (In addition, up to 10 devices can be simultaneously connected via the Internet.) Devices that are connected must be prepared to receive updates about added/modified/deleted information. This can be caused e.g. by an Override ending, a button on a Nobo Switch being pressed or another user modifying data from a connected app.

## Auto discovery of hubs

Every two seconds, the Hub sends one UDP broadcast packet on port `10000` to broadcast IP `255.255.255.255`, and one UDP multicast packet on port 10001 to multicast IP `239.0.1.187`.

You can use this information to discover Hubs on the network and identify their current IP address and the first 9 of the 12 digits of the Hub’s unique serial number. Sending 9 of 12 digits of the serial number is not intended to be a security measure, but a way for users to be explicit about which Hub they wat to connect to, to avoid possible confusion when using several Hubs in the same network.

The data that is sent from the Hub is the following ASCII string:
`__NOBOHUB__123123123`, where `123123123` is replaced with the first 9 digits of the Hub’s serial number. There are two underscore characters `__` before and after the `NOBOHUB` string. This string is NOT ended with a carriage return.

From time to time the Hub will reboot (automatically approximately every 18 hours) or re-run DHCP to acquire a new IP address from the DHCP server on the network (usually found at the network router). If connection to a Hub is lost, listen for these broadcast/multicast messages to identify the new IP address of the Hub. If several Hubs on the network have the same first 9 digits in their serial number, you have to try connecting to each one until you find the correct one.

## Handshake

This chapter describes the process of establishing a session between a Hub (H) and an
application (A). When connecting on the local network (LAN), this is TCP network traffic on a network socket on port `27779`:

- A: `HELLO <its version of command set> <Hub s.no.> <date and time in format 'yyyyMMddHHmmss'>\r`
- H: `HELLO <its version of command set>\r", or "REJECT <reject code>\r`
- A: Sends `REJECT\r` if command set is not supported. OR sends `HANDSHAKE\r`
- H: `HANDSHAKE\r`
- Now connection is established!

Reject code:

- 0 = client command set version too old (or too new!).
- 1 = Hub serial number mismatch.
- 2 = Wrong number of arguments.
- 3 = Timestamp incorrectly formatted

`\r` = a carriage return.

Example:

A: `HELLO 1.1 102000000123 20131220092040\r`

H: `HELLO 1.1\r`

A: `HANDSHAKE\r`

H: `HANDSHAKE\r`

Immediately following a successful handshake, the application should send a `G00\r` command to download all relevant information from the Hub. The application knows that a G00 command is finished when the Hub sends the H05 (hub info) command to the application. See the next chapter for more info.

## Command set compatibility

The command set version is described by major version X and minor version Y in the format `X.Y`. New minor versions will always be backwards-compatible with older minor versions. To ensure this backwards-compatibility, two things are required:

1. You must implement a client to always ignore unknown commands (if for example a Y02 command is sent from a hub to a client implemented with the 1.0 version of the API, it will be ignored).
2. More parameters (separated by space) in each command/reply received from the Hub must be allowed (but should be ok to ignore), to support extensions of the API in the future.

We believe that we will never have to update to an incompatible command set version (2.0). That is at least our goal. Glen Dimplex Nordic reserves the right to modify the API in non-backwards compatible ways, but we will try to avoid this, and inform our official partners as soon as possible if we do.

## Command set

Please see the end of this document for the commands that are sent to and from the hub.

**Feature limitations**:

The following functionality is not yet implemented/not supported on the Hub or are limited. Please conform to the following rules:

- **Hub** Snr, ActiveOverrideId, SoftwareVersion, HardwareVersion and ProductionDate are read only fields.
- **Zone** ID is a read only field.
- **Zone** Active override id is always -1 (deprecated field).
- **Component** Serial number cannot be modified – the Component must in that case be removed and added with the new serial number.
- **Component** Active override id is always `-1` (local component overrides are not implemented).
- **Component** Status field is not yet in use. Always write a `0` to this field.
- **Week Profile** ID is a read only field.
- **Week Profile** Profile can contain maximum 672 timestamps. Timestamps must have 00, 15, 30 or 45 for the minute field to be compatible with the app interface that only allows 15 minute intervals.
- **Override** ID is a read only field.
- **Override** Target must be `0` or `1`, and Override target ID must be `-1` (for global hub overrides) or Zone's ID (for local zone overrides). Local Component overrides are not implemented.

**Definitions of "status" when describing Week Profiles**:

The last digit in a Week Profile "Profile" is coded as follows:

- 0: Eco mode
- 1: Comfort mode
- 2: Anti frost mode (a.k.a. "Away")
- 3: Off

**Note regarding error messages**:

The Hub might send error messages other than E00.

**Note regarding string lengths**:

Maximum string lengths are specified in bytes. Note that in the UTF-8 encoding, one character might be stored as more than one byte (1-6 bytes per character)!

Max lengths:

1. Hub name: 150 bytes.
2. Zone name: 100 bytes.
3. Component name: 100 bytes.
4. Week Profile name: 150 bytes.

Please make sure that the Hub does not receive strings that are too long.

**Note regarding IDs of new elements**:

The Hub ignores the incoming IDs of new Zone, Week Profile or Override elements, and instead returns a newly assigned ID for the element. A dummy ID must still be sent with the command from the application that is creating the new element.

## Reset function

To reset the Hub, insert a special 2,5mm mini jack plug into the Hub, and plug in the power. The Hub is reset – all settings are set to default and all Components, Zones, Overrides and added Week Profiles are deleted. Hub Serial number, MAC address, Production date, Hardware version and Software version is not affected by this reset function.

Reset plug: 2,5mm mini jack plug where the Tx and Rx are connected/soldered to each other, and the ground is left not connected. The two outmost connectors are soldered to each other.

# Command set

## Data structures

### Hub

The command structure for hubs

**Structure composition**

    <Snr> <Name> <DefaultAwayOverrideLength> <ActiveOverrideId> <SoftwareVersion> <HardwareVersion> <ProductionDate>

- `Snr` Hub Serial Number
- `Name` Name of hub. Note that any spaces here is encoded as non-brake-space (ASCII character 160)
- `DefaultAwayOverrideLength` Default length over Away override
- `ActiveOverrideId` ID of Active override. `-1` is none.
- `SoftwareVersion` Software version the hub is running.
- `HardwareVersion` Hardware version of the hub. Alphanumeric plus `.`.
- `ProductionDate` Production date fo the hub. Format `yyyyMMdd`.

**Example**

    200045185039 name_of_hub 13 23 1.2 1f 20130813

### Zone

The command structure for zones. Id is according to the hub's database. Temperatures are in celsius.

NOTE: This structure does not include components that belong to this zone.

**Structure composition**

    <Zone id> <Name> <Active week profile id> <Comfort temperature> <Eco temperature> <Allow overrides> <Active override id>

- `Zone id`
- `Name` Name of zone. Note that any spaces here is encoded as non-brake-space (ASCII character 160).
- `Active week profile id` ID of Active Week Profile. Must always have a valid value (never `-1`). The Hub has a read-only default Week Profile with ID=1
- `Comfort temperature` Degrees Celsius. Expected to be an integer in the range 7 to 30. The client should ensure that the `Comfort temperature` setpoint is at least as large as the `Eco temperature`.
- `Eco temperature` Degrees Celsius. Expected to be an integer in the range 7 to 30. The client should ensure that the `Eco temperature` setpoint is not larger than the `Comfort temperature`.
- `Allow overrides` 1 = Yes, 0 = No.
- `Active override id` _Deprecated_. Always set to `-1`.

**Example**

    2 ZoneName 1 23 15 0 -1

### Component

The command structure for components.

**Structure composition**

    <Serial number> <Status> <Name> <Reverse on/off> <ZoneId> <Active override id> <Temperature sensor for zone>

- `Serial number` Serial number format is `aaabbbcccddd`. Each group in the serial number (aaa, bbb, etc) is an 8 bit integer no higher than 255.
- `Status` Not yet implemented – always set to `0`
- `Name` Name of component. Note that any spaces here is encoded as non-brake-space (ASCII character 160)
- `Reverse on/off` Only applicable for some components and should be 0 unless explicitly specified.
- `ZoneId` Id of the Zone the component is connected to. Value is `-1` if no association.
- `Active override id` Not yet implemented – always set to `-1`. (ID of Active override. `-1` if none)
- `Temperature sensor for zone` Id of the zone the component is used as a temperature sensor for. Value is `-1` if no association.

**Example**

    200154035201 0 component_name 0 -1 23 2

### WeekProfile

The command structure for week profiles.

**Structure composition**

    <Week profile id> <Name> <Profile>

- `Week profile id` Id according to the Hub database
- `Name` Name of week profile. Note that any spaces here is encoded as non-brake-space (ASCII character 160)
- `Profile` Comma separated list of time stamps (`HHMM`) where the program changes and what status it has in the following time period, e.g. 13451. The time stamp 0000 (midnight) has to be specified for each day no matter if the program changes or not, making a valid week profile containing exactly 7 occurrences of these.

**Example**

    12 week_profile_name 00000,02154,13453,00001,08000,16301,00000,00001,00001,00002,00002

### Override

The command structure for overrides.

**Structure composition**

    <Id> <Mode> <Type> <End time> <Start time> <Override target> <Override target ID>

- `Id` Id of override
- `Mode` Either
  - 0 – Normal
  - 1 - Comfort
  - 2 - Eco
  - 3 - Away
- `Type` Type is what kind of an override it is:
  - 0 – Now
  - 1 – Timer
  - 2 – From-To
  - 3 – Constant
- `End time` Only used when type is `Timer` or `From-To` (`-1` in all other cases)
- `Start time` Only used when type iss `From-To` (`-1` in all other cases)
- `Override target` Only global (Hub) and zone-local overrides are implemented yet – always set to `0` or `1`:
  - 0 – Hub
  - 1 – Zone
  - 2 – Component
- `Override target ID` The id for the override target. If override target is `0` (hub), use `-1`. If override target is `1` (zone) use the zone's ID. If override target is `2` (component), use component's 12 digit serial number. Component overrides (override target id - `2`) are not yet supported.

**Example**

    1 2 0 -1 -1 0 1

## Commands

### Add

#### A00 – Add zone

Adds a Zone to hub's internal database.

**Arguments**

- `zone` [Zone](#zone) to add. Zone id and Active override id is ignored

**Command structure**

    A00 <Zone id> <Name> <Active week profile id> <Comfort temperature> <Eco temperature> <Allow overrides> <Active override id>

**Command example**

    A00 2 ZoneName 1 23 15 0 -1

**Return**

Either one of the following commands: [B00](#b00)
