# cti-stix2-json-schemas - FINSTIX support

*The current repository is a fork/extension of [OASIS TC Open Repository - cti-stix2-json-schemas](https://github.com/oasis-open/cti-stix2-json-schemas). See the [Governance](#governance) section for more information.*

This repository contains non-normative JSON schemas and examples for STIX 2. 
The examples include short examples of particular objects, more complete use-case examples, and complete reports in STIX 2.

The repository targets to support both STIX JSON documents as well as FINSTIX objects.
It contains both the JSON schemas needed for consistency and validation purposes as well as some examples of custom objects developed for the FINSEC needs.

**NOTE:** The schemas in this repository are intended to follow the [STIX 2.0 Specification](https://www.oasis-open.org/standards#stix2.0), but some requirements of the specification cannot be enforced in JSON schema alone. As a result, these schemas are insufficient to determine whether a particular example of STIX 2.0 JSON is "valid". Additionally, though care has been taken to ensure that these schemas do not conflict with the specification, in case of conflict, the specification takes precedence.

Some of the checks the schemas do not contain:

- The objects are related to each other using the _ref or _refs keys
- All custom FINSEC objects are STIX compatible. They use the "x-" prefix for the object type and inherit all stix optional properties (revoked, name, description, granular_markings and so on)
- Examples can be validated with STIX validator (https://github.com/oasis-open/cti-stix-validator)
- Vulnerability object is rewritten to support FINSEC needs. In particular x-vulnerability is introduced with all the necessary metrics (CVSS v3)
- Custom Objects: Organization, Asset, Probe, Probe Configuration, Event, Area, Risk, Vulnerability, Regulation, Service, Threat
- Stix objects: Attack-pattern, Identity, Campaign, Course-of-action, Indicator, Intrusion-set, Malware, Observed-data, Report, Threat-actor, Tool, Vulnerability (legacy)


- Next steps:
Improve threat and risk object
Align with FINSTIX (for relationships and hierarchy with "reference" field)
Add model support (right now only instances are provided)
Add strict control in custom properties

