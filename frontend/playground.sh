curl -X GET "http://localhost:2078/api/v1/business-membership/2cdcc0ea-e365-441e-882e-c7f78f121c62/requests" \
  -H "Accept: application/json" \
  --cookie "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODg1YjA0LTBiYzgtNDk3Mi1iNGMwLTVlYmU0OGY3MzIxZSIsImVtYWlsIjoiYWRhbm5hQG11Y2tzd29uLmNvbSIsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTc2ODIwNzY1NiwiZXhwIjoxNzY4MjExMjU2fQ.omx9AEVbxgfSv9bUYPJ5wA9-I3Kq2Ts6ZdWXaq4MiqE"


curl -X 'POST' \
  'http://localhost:2078/api/v1/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "netdata@muckswon.com",
  "password": "Adanna12!"
}' | jq