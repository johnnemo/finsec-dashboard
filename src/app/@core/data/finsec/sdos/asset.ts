// To parse this data:
//
//   import { Convert, Asset } from "./file";
//
//   const asset = Convert.toAsset(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
import {Finsec} from "./finsec";

/**
 * An asset represents properties of the organization.
 */
export interface Asset extends Finsec {

  asset_type: string;
  /**
   * The name of the x-asset.
   */
  name: string;
  /**
   * A description that provides more details and context about the asset.
   */
  description: string;
  /**
   * Defines if the asset is a main one or a sub-asset. It can be Main or Sub.
   */
  subtype: string;
  /**
   * The domain the asset belongs to. It can be Cyber, Physical or Hybrid.
   */
  domain: string;
  /**
   * Datatype can be Model or Instance. Model indicates that the object is a model that can be
   * used as a basis for the analytics. Instance is used when the object is generated at
   * run-time.
   */
  datatype: string;
  /**
   * Reference to the asset/area of interest/organization the asset is part of.
   */
  reference: string;
  /**
   * Reference to the organization which is owner of the information contained in the object.
   */
  x_organization: string;
  /**
   * Criticality on confidentiality.
   */
  confidentiality_value: number;
  /**
   * Criticality on integrity.
   */
  integrity_value: number;
  /**
   * Criticality on availability.
   */
  availability_value: number;
  /**
   * Typical loss (in Euros) because of integrity.
   */
  loss_typical_integrity: number;
  /**
   * Typical loss (in Euros) because of availability.
   */
  loss_typical_availability: number;
  /**
   * Typical loss (in Euros) because of confidentiality.
   */
  loss_typical_confidentiality: number;
  /**
   * Worst case loss (in Euros) because of integrity.
   */
  loss_worst_integrity: number;
  /**
   * Worst case loss (in Euros) because of availability.
   */
  loss_worst_availability: number;
  /**
   * Worst case loss (in Euros) because of confidentiality.
   */
  loss_worst_confidentiality: number;
  /**
   * Specifies the physical location of the asset (latitude,longitude).
   */
  coordinates?: any;
  /**
   * The domain name if available, e.g(google.com).
   */
  domain_name?: string;
  /**
   * The IP version 4 address of the probe.
   */
  ipv4_addr?: string;
  /**
   * The IP version 6 address of the Probe.
   */
  ipv6_addr?: string;
  /**
   * Is used by the asset with datatype instance to refer to the related model.
   */
  model_ref?: string;
  /**
   * The network type this asset belongs. Open Vocab - asset-network-type-ov.
   */
  network_type?: string;
  /**
   * The operating system installed in the asset. Open vocab - asset-os-ov.
   */
  operating_system?: string;
  /**
   * The version of the operating system in use.
   */
  operating_system_version?: string;
  /**
   * The product name of the asset.
   */
  product_name?: string;
  /**
   * The vendor of the product identified by the asset (e.g. Intel).
   */
  product_vendor?: string;
  /**
   * The version of the product identifying the asset.
   */
  product_version?: string;
  /**
   * References to the vulnerabilities of this asset.
   */
  vuln_refs?: any[];
}


