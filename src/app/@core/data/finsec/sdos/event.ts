// To parse this data:
//
//   import { Convert, Event } from "./file";
//
//   const event = Convert.toEvent(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import {Finsec} from "./finsec";

/**
 * Identifies an event produced by a probe.
 */
export interface Event extends Finsec {
  /**
   * The name of the event.
   */
  name: string;
  /**
   * A quick description of the event.
   */
  description: string;
  /**
   * Specifies the domain of the event. It can be Cyber, Physical or Hybrid.
   */
  domain: Domain;
  /**
   * Datatype can be Model or Instance. Model indicates that the object is a model that can be
   * used as a basis for the analytics. Instance is used when the object is generated at
   * run-time.
   */
  datatype: Datatype;
  /**
   * If datatype is Model, it contains a reference to a generic root; otherwise, it contains
   * the reference to the corresponding model event.
   */
  reference: string;
  /**
   * Reference to the organization which is owner of the information contained in the object.
   */
  x_organization: string;
  /**
   * If datatype is Model, it is empty; otherwise it contains the reference to the probe that
   * generated the event.
   */
  probe_ref: string;
  /**
   * Specifies the agents detected in the current event.
   */
  agent_refs?: string[];
  /**
   * If datatype is Model, it is empty; otherwise it contains the references to the assets
   * involved in the event.
   */
  asset_refs?: string[];
  /**
   * Specifies the physical location of the event detected (latitude,longitude).
   */
  coordinates?: any;
  /**
   * The keys contained depend on the probe who generated the event.
   */
  details?: Details;
  /**
   * Is used by the event with datatype Instance to refer to the related model.
   */
  model_ref?: string;
  /**
   * If datatype is Model, it is empty; otherwise it contains the references to the observed
   * data that are related to the event.
   */
  observed_refs?: string[];
  /**
   * Can be used to specify the type of event through the taxonomy used by the XL-SIEM and the
   * Risk Analysis Engine tool.
   */
  subtype?: string;
}

/**
 * Datatype can be Model or Instance. Model indicates that the object is a model that can be
 * used as a basis for the analytics. Instance is used when the object is generated at
 * run-time.
 */
export enum Datatype {
  Instance = "Instance",
  Model = "Model",
}

/**
 * The keys contained depend on the probe who generated the event.
 */
export interface Details {
  /**
   * The active nodes associated with the transaction.
   */
  active_nodes?: number;
  /**
   * The transaction amount.
   */
  amount?: number;
  /**
   * The type of the detail inner object.
   */
  detail_type?: DetailType;
  /**
   * The average block generation rate.
   */
  generation_rate?: number;
  /**
   * The number of addresses associated with the transaction.
   */
  num_addresses?: number;
  /**
   * Operation Type under execution.
   */
  operation?: Operation;
  /**
   * The transaction payee address.
   */
  payee_addr?: string;
  /**
   * The transaction payer address.
   */
  payer_addr?: string;
  /**
   * The propagation rate.
   */
  propagation_rate?: number;
  /**
   * Number of transactions per block.
   */
  trans_per_block?: number;
  /**
   * Code used by the Risk Assessment Engine to indentify the type of event.
   */
  type_code?: string;

  /**
   * Specifies the date/time the last block was detected.
   */
  last_block?: string;
}

/**
 * The type of the detail inner object.
 */
export enum DetailType {
  Blockchain = "blockchain",
  Hybrid = "hybrid",
  P2PPayment = "p2p_payment",
}

/**
 * Operation Type under execution.
 */
export enum Operation {
  Payment = "payment",
}

/**
 * Specifies the domain of the event. It can be Cyber, Physical or Hybrid.
 */
export enum Domain {
  Cyber = "Cyber",
  Hybrid = "Hybrid",
  Physical = "Physical",
}

/**
 * It MUST be the literal `x-event`.
 */
export enum Type {
  XEvent = "x-event",
}
