
interface H3cipFeatureProperty{
    "messageID": number; // TODO or string?
    "messageDateTime": Date;
    "identifier": string;
    "messageScope": string;
    "timestamp": Date;
    "location_name": string;
    "location_lat": number;
    "location_lng": number;
    "operatorName": string;
    "location_phone": string;
    "location_email": string;
    "threat": string;
    "incidentType": string;
    "incidentSubstances": string;
    "asset": string;
    "areaDesc": string;
    "location": string;
    "consequences": string;
    "internalActualConseq": number;
    "responseType": string;
    "externalActualConseq": string; // TODO number or string
    "risk": number;
    "securityLevel": number;
    "availableMeans": string;
    "accessRoutes": string;
    "additionalInfo": string;
};

interface H3cipFeatureGeometry{
  "type": string;
  "coordinates": any[];
}

interface H3cipFeature {
  "type": string;
  "properties": H3cipFeatureProperty;
  "geometry": H3cipFeatureGeometry
};

export interface H3cip{
  // Example Record
  // {
  //   "type": "FeatureCollection",
  //   "features": [
  //     {
  //     "type": "Feature",
  //     "properties": {
  //       "messageID":"97834",
  //       "messageDateTime":"2020-01-01T00:00:00+00:00",
  //       "identifier":"e79bd885-0753-4f69-b5a9-a11880847aab",
  //       "messageScope":"0",
  //       "timestamp":"2020-01-01T00:00:00+00:00",
  //       "location_name":"DEPA CNG Station Anthousa",
  //       "location_lat":"3.9461",
  //       "location_lng":"2.6924",
  //       "operatorName":"Marc Brown",
  //       "location_phone":"+302101234567",
  //       "location_email":"marc.brown@operator.com",
  //       "threat":"Man portable Improvised Explosive Device (IED)",
  //       "incidentType":"Fire",
  //       "incidentSubstances":"Natural Gas",
  //       "asset":"CNG inlet section",
  //       "areaDesc":"NW fence & Control room",
  //       "location":"3.4342, 4.5143",
  //       "consequences": "3 casualties, 4 hours of downtime",
  //       "internalActualConseq": "4",
  //       "responseType":"Send UAV, Run",
  //       "externalActualConseq":"2",
  //       "risk": "0.866",
  //       "securityLevel":"3",
  //       "availableMeans":"Πυροσβεστικά μέσα",
  //       "accessRoutes":"Open, Delayed, Closed",
  //       "additionalInfo":"Traffic jams across Mesogeion avenue"
  //       },
  //       "geometry": {
  //         "type": "Point",
  //         "coordinates": [23.950,38.20]
  //       }
  //     },
  //     {
  //       "type": "Feature",
  //       "properties": {
  //         "name":"polygon1",
  //         "date":"2020-11-22",
  //         "field1":"30",
  //         "field2":"cip2",
  //         "field3":"0.800",
  //         "dhw":"16.136",
  //         "alert":"5",
  //         "hazard":"name1",
  //         "field4":"test",
  //         "imagefile":"file1.bmp"
  //       },
  //       "geometry": {
  //         "type": "MultiPolygon",
  //         "coordinates": [
  //           [
  //             [
  //               [23.950,38.100],
  //               [23.950,38.125],
  //               [23.950,38.150],
  //               [23.950,38.175],
  //               [23.950,38.200],
  //               [23.950,38.225],
  //               [23.950,38.250],
  //               [23.975,38.250],
  //               [23.975,38.100],
  //               [23.950,38.100]
  //             ]
  //           ]
  //        ]
  //       }
  //     }
  //   ]
  // }
  "type": string;
  "features": H3cipFeature[];
};
