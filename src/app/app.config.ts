const CONFIG = {


  // collaborative_risk_url: 'http://mitigate-backend.test', //for local testing
  // pagination_url: 'http://127.0.0.1:80/api/v1/retrieve', //for local testing

  blockchain_base_url: 'http://188.166.18.8',
  /*
  TODO: add the new enpoint for the dashboard backend
  */
  pagination_url: '/backend/api/v1/retrieve',
  finsec_base_url: '/finsec',
  finsec_retrieve_url: '/finsec/data-layer/search',
  finsec_retrieve_url_stream: '/finsec/data-layer/dbstream',
  finsec_aggregate_url: '/finsec/data-layer/aggregate',
  finsec_create_url: '/finsec/data-layer/create',
  finsec_kb_url: '/finsec/data-layer/retrievekb',
  finsec_kb_create_url: '/finsec/data-layer/insert',
  keycloak: '/keycloak/auth/realms/finsec-project.eu/protocol/openid-connect/token/',
  collaborative_risk_url: '/finsec/collaborative-risk',
  anomaly_detection_url: '/finsec/anomaly-detection',
  risk_assessment_url: '/finsec/risk-assessment-engine',
  audit_service_url: '/finsec/audit-service',
  tls_assistant_url: '/finsec/tls-assistant',
  predictive_analytics_url: '/finsec/predictive-analytics',
  mitigation_service_url: '/finsec/mitigation-service',
  mapboxToken: 'pk.eyJ1IjoiZ2drb3RzaXMiLCJhIjoiY2llbDd4N2oxMDAxbHVobTdtNmVkMnVwdSJ9.gHPFEY93Z9VfTodpEaEd2A',
};
export default CONFIG;
