# Delete Account Company - API Specifications

## Overview

This API specification covers the process of deleting a company account in a single, simple call. The user provides the deletion reason, feedback, and password verification all at once.

---

## API Endpoint

### Delete Company Account

**Purpose**: Deletes the company account after verifying the password and recording the deletion reason.

#### Endpoint

```
DELETE core/api/v1/account/company
```

#### Method

`DELETE`

#### Request Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

#### Request Payload

```json
{
  "deletion_reason_id": "int",
  "suggestion_feedback": "string",
  "password": "string"
}
```

#### Payload Details

| Field                 | Type   | Required | Description                                                                                                      |
| --------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `deletion_reason_id`  | int    | Yes      | The selected reason from dropdown (e.g., "service_not_needed", "poor_performance", "switching_service", "other") |
| `suggestion_feedback` | string | No       | Additional feedback or suggestions from the user (max 500 characters)                                            |
| `password`            | string | Yes      | The user account password for verification                                                                       |

#### Response (Success)

```json
{
  "status": "success",
  "message": "Company account deleted successfully"
}
```

#### Response (Error - Wrong Password)

```json
{
  "status": "error",
  "message": "Password verification failed",
  "error_code": "invalid_password"
}
```

#### Response (Error - Invalid Input)

```json
{
  "status": "error",
  "message": "Invalid input data",
  "error_code": "invalid_input",
  "details": "string"
}
```

#### Response (Error - Company Not Found)

```json
{
  "status": "error",
  "message": "Company not found",
  "error_code": "company_not_found"
}
```

#### Status Codes

- `200 OK` - Account deleted successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Invalid password
- `404 Not Found` - Company not found

---

## Error Codes Reference

| Error Code          | Meaning                      | What To Do                           |
| ------------------- | ---------------------------- | ------------------------------------ |
| `invalid_password`  | Password is wrong            | Ask user to enter correct password   |
| `invalid_input`     | Missing or wrong data format | Check all required fields are filled |
| `company_not_found` | Company ID doesn't exist     | Verify company ID is correct         |
| `unauthorized`      | User not logged in           | User needs to login first            |

# Delete Personal Account - API Specifications

## Overview

This API specification covers the process of deleting a personal user account while preserving the user's remaining personal profile data. The user provides the deletion reason, feedback, and password verification all in one request using the DELETE HTTP method.

When this API is used, the system removes the user's company membership instead of permanently deleting the personal account record.

---

## API Endpoint

### Delete Personal Account

**Purpose**: Removes the user's active company membership after verifying the password and recording the deletion reason, while keeping the remaining personal account data.

#### Endpoint

```
DELETE core/api/v1/account/user
```

#### Method

`DELETE`

#### Request Headers

```
Authorization: Bearer ***
Content-Type: application/json
```

#### Header Details

| Header          | Required | Description                                                               |
| --------------- | -------- | ------------------------------------------------------------------------- |
| `Authorization` | Yes      | Bearer token for authentication (format: `Bearer your_access_token_here`) |
| `Content-Type`  | Yes      | Must be `application/json`                                                |

#### Request Payload

```json
{
  "deletion_reason_user_id": "int",
  "suggestion_feedback": "string",
  "user_password": "string"
}
```

#### Payload Details

| Field                     | Type   | Required | Description                                                           |
| ------------------------- | ------ | -------- | --------------------------------------------------------------------- |
| `deletion_reason_user_id` | int    | Yes      | The selected user deletion reason from dropdown                       |
| `suggestion_feedback`     | string | No       | Additional feedback or suggestions from the user (max 500 characters) |
| `user_password`           | string | Yes      | The personal account password for verification                        |

#### Business Behavior

When the request is successful, the system performs these actions:

1. Verifies the authenticated user's password.
2. Records the selected deletion reason and optional feedback.
3. Soft deletes the related row in `company_teams`.
4. Removes the relation between `admin_jps` and `companies`.
5. Keeps the remaining personal data in `admin_jps` as an active personal account record, unless another separate business rule disables it.

#### Data Impact

| Table           | Action          | Description                                                                               |
| --------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `company_teams` | Soft delete     | Marks the company membership/team record as deleted without permanently removing row data |
| `admin_jps`     | Update relation | Removes the company relationship reference while preserving personal profile data         |
| `companies`     | No delete       | Company master data remains unchanged                                                     |

#### Response (Success)

```json
{
  "status": "success",
  "message": "Personal account deleted successfully",
  "data": {
    "deletion_id": "del_987654321",
    "deleted_at": "2026-01-22T10:30:00Z",
    "notification_email": "user@example.com",
    "membership_removed": true,
    "personal_data_retained": true
  }
}
```

#### Response (Error - Wrong Password)

```json
{
  "status": "error",
  "message": "Password verification failed",
  "error_code": "invalid_password"
}
```

#### Response (Error - Invalid Token)

```json
{
  "status": "error",
  "message": "Invalid or expired authentication token",
  "error_code": "invalid_token"
}
```

#### Response (Error - Invalid Input)

```json
{
  "status": "error",
  "message": "Invalid input data",
  "error_code": "invalid_input",
  "details": "string"
}
```

#### Response (Error - User Not Found)

```json
{
  "status": "error",
  "message": "User account not found",
  "error_code": "user_not_found"
}
```

#### Status Codes

- `200 OK` - Account deletion process completed successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid bearer token
- `403 Forbidden` - Invalid password or token expired
- `404 Not Found` - User account not found

---

## Error Codes Reference

| Error Code         | Meaning                            | What To Do                           |
| ------------------ | ---------------------------------- | ------------------------------------ |
| `invalid_password` | Password is wrong                  | Ask user to enter correct password   |
| `invalid_input`    | Missing or wrong data format       | Check all required fields are filled |
| `user_not_found`   | User ID doesn't exist              | Verify user is logged in correctly   |
| `invalid_token`    | Bearer token is missing or expired | User needs to login again            |
| `unauthorized`     | User not authorized to delete      | Contact support for help             |

---

## Example Implementation Flow

1. User logs in and receives an access token.
2. User selects deletion reason from dropdown on first page.
3. User enters optional feedback in textarea.
4. User enters password on confirmation page.
5. All data is sent in one DELETE request with Bearer token: `DELETE /api/v1/account/user`.
   - Request includes Authorization header with Bearer token.
6. System verifies token and password.
7. System records deletion reason and feedback.
8. System soft deletes the related `company_teams` record.
9. System removes the relation between `admin_jps` and `companies`.
10. System keeps the remaining personal data for the user account.
11. User gets success or error response.

---

## Example cURL Request

```bash
curl -X DELETE https://api.example.com/api/v1/account/user \
  -H "Authorization: Bearer ***" \
  -H "Content-Type: application/json" \
  -d '{
    "deletion_reason_user_id": 1,
    "suggestion_feedback": "I no longer need company access",
    "user_password": "user_secure_password"
  }'
```

---

## Important Notes

- This API does **not** permanently remove the remaining personal data in `admin_jps`.
- This API **does** soft delete the related `company_teams` row.
- This API **does** remove the relationship between the user and company data.
- `companies` data remains unchanged.
- The deletion reason helps improve the service and understand account exit patterns.
- If the user needs full permanent data erasure, that must be handled by a separate business process or endpoint.
