// To parse this data:
//
//   import { Convert, Finsec } from "./file";
//
//   const finsec = Convert.toFinsec(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import {Hashes} from './hashes';

/**
 * Common properties and behavior across all STIX Domain Objects and STIX Relationship
 * Objects.
 */
export interface Finsec {
  /**
   * The created property represents the time at which the first version of this object was
   * created. The timstamp value MUST be precise to the nearest millisecond.
   */
  created: string;
  /**
   * The ID of the Source object that describes who created this object.
   */
  created_by_ref?: string;
  /**
   * A list of external references which refers to non-STIX information.
   */
  external_references?: ExternalReference[];
  /**
   * The set of granular markings that apply to this object.
   */
  granular_markings?: GranularMarking[];
  /**
   * The id property universally and uniquely identifies this object.
   */
  id: string;
  /**
   * The labels property specifies a set of classifications.
   */
  labels?: string[];
  /**
   * The modified property represents the time that this particular version of the object was
   * created. The timstamp value MUST be precise to the nearest millisecond.
   */
  modified: string;
  /**
   * The list of marking-definition objects to be applied to this object.
   */
  object_marking_refs?: string[];
  /**
   * The revoked property indicates whether the object has been revoked.
   */
  revoked?: boolean;
  /**
   * The type property identifies the type of STIX Object (SDO, Relationship Object, etc). The
   * value of the type field MUST be one of the types defined by a STIX Object (e.g.,
   * indicator).
   */
  type: string;
}

export interface ExternalReference {
  /**
   * A human readable description
   */
  description?: string;
  /**
   * An identifier for the external reference content.
   */
  external_id: string;
  hashes?: Hashes;
  /**
   * The source within which the external-reference is defined (system, registry,
   * organization, etc.)
   */
  source_name: string;
  /**
   * A URL reference to an external resource.
   */
  url?: string;
}

export interface GranularMarking {
  marking_ref?: string;
  /**
   * A list of selectors for content contained within the STIX object in which this property
   * appears.
   */
  selectors?: string[];
}

