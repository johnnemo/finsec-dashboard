// import mongoose, {Schema} from "mongoose";
//
// const artemisEventInfoAreaSchema = new mongoose.Schema({
//   areaDesc: Schema.Types.String,
//   location: Schema.Types.String // TODO convert it to GeoJSON if possible?
// });
//
// const artemisEventInfoSchema = new mongoose.Schema({
//   areas: [artemisEventInfoAreaSchema],
//   asset: Schema.Types.String,
//   category: Schema.Types.String,
//   consequences: [Schema.Types.String],
//   domain: Schema.Types.String,
//   responseType: [Schema.Types.String],
//   risk: Schema.Types.Number,
//   threat: Schema.Types.String,
//   threatCategory: Schema.Types.String,
// });
//
// const artemisEventSchema = new mongoose.Schema({
//   id: Schema.Types.ObjectId,
//   identifier: Schema.Types.String,
//   infos: [artemisEventInfoSchema],
//   location_email: Schema.Types.String,
//   location_lat: Schema.Types.Number,
//   location_lng: Schema.Types.Number,
//   location_name: Schema.Types.String,
//   location_phone: Schema.Types.String,
//   sender: Schema.Types.String,
//   sent: Schema.Types.Date,
//   timestamp: Schema.Types.Date,
//   operator_input: Schema.Types.Mixed,
//   forwardedAt: Schema.Types.Date,
//   from: Schema.Types.String
// },  { timestamps: true });
//
// /*  Example:
//   {
//     "identifier": "e79bd885-0753-4f69-b5a9-a11880847aab", // 1
//     "sender": "ARTEMIS",
//     "sent": "2020-01-01T00:00:00+00:00",
//     "timestamp": "2020-01-01T00:00:00+00:00", // 2
//     "location_name": "DEPA CNG Station Anthousa", // 3
//     "location_lat": 37.9460000000, // 4
//     "location_lng": 23.6924710000, // 4
//     "location_phone": "210...", // 5
//     "location_email": "..@...com", // 6
//
//     "infos": [{
//             "category": "RMG increased risk alert",
//             "threatCategory": "",
//             "threat": "Man portable Improvised Explosive Device (IED)", // 7
//             "asset": "Storage tanks", // 8
// 			"domain": "domainDescription",
//             "risk": 0.8660921454429626, // 12
//             "consequences": ["3 casualties", "4 hours of downtime"], // 10, 11
//             "responseType": ["Send UAV", "Run"],
//             "areas": [{ // 9
//                     "areaDesc": "NW fence & Control room",
//                     "location": "POINT (3.43422882743858 4.514377230740358)"
//                 }
//             ]
//         },
//         {
//                 "category": "RMG increased risk alert",
//                 "threatCategory": "",
//                 "threat": "Man portable Improvised Explosive Device (IED)",
//                 "asset": "Storage tanks",
//                 "risk": 0.8660921454429626,
//                 "consequences": ["3 casualties", "4 hours of downtime"],
//                 "responseType": ["Send UAV", "Run"],
//                 "areas": [{
//                         "areaDesc": "NW fence & Control room",
//                         "location": "POINT (3.43422882743858 4.514377230740358)"
//                     }
//                 ]
//             }
//     	]
// }*/
//
// export default mongoose.model("ArtemisEvent", artemisEventSchema);
