

# end pionts


get
http://localhost:3000/api/shorten/EtMbOT
{
  "id": "681563e3854fca3635081917",
  "url": "https://www.example.com/some/long/url11",
  "shortCode": "EtMbOT",
  "createdAt": "2025-05-03T00:31:31.984Z",
  "updatedAt": "2025-05-03T00:33:53.747Z"
}


post
http://localhost:3000/api/shorten

{
  "url": "https://www.example.com/some/long/ur111"
}

put
http://localhost:3000/api/shorten/EtMbOT

{
  "url": "https://www.example.com/some/long/url"
}

delete
http://localhost:3000/api/shorten/EtMbOT


get
http://localhost:3000/api/shorten/EtMbOT/stats

{
  "id": "681563e3854fca3635081917",
  "url": "https://www.example.com/some/long/url11",
  "shortCode": "EtMbOT",
  "createdAt": "2025-05-03T00:31:31.984Z",
  "updatedAt": "2025-05-03T00:32:32.782Z",
  "accessCount": 1
}