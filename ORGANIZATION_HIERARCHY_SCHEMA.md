# Organization Hierarchy Database Schema

This document describes the database schema for implementing a hierarchical organization structure where:
- One organization can have multiple admins
- One admin can have multiple users

## Tables

### 1. Organizations

```sql
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  industry VARCHAR(100),
  website VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  logo_url VARCHAR(255),
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  owner_phone VARCHAR(50)
);
```

### 2. Organization Admins

```sql
CREATE TABLE organization_admins (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id INTEGER UNIQUE, -- Reference to users table if using existing users
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'manager')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, email)
);
```

### 3. Admin Users

```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES organization_admins(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id INTEGER UNIQUE, -- Reference to users table if using existing users
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'editor', 'viewer', 'contributor')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  department VARCHAR(100),
  position VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  UNIQUE(admin_id, email),
  UNIQUE(organization_id, email)
);
```

### 4. Users (Optional - if not using existing users table)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  avatar_url VARCHAR(255)
);
```

## Relationships

1. **Organization to Admins**: One-to-Many
   - One organization can have multiple admins
   - Foreign key: `organization_admins.organization_id` → `organizations.id`

2. **Admin to Users**: One-to-Many
   - One admin can have multiple users
   - Foreign key: `admin_users.admin_id` → `organization_admins.id`

3. **Organization to Users**: One-to-Many (through admins)
   - One organization can have many users through its admins
   - Foreign key: `admin_users.organization_id` → `organizations.id`

## Indexes

```sql
-- Organizations
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_industry ON organizations(industry);
CREATE INDEX idx_organizations_created_at ON organizations(created_at);

-- Organization Admins
CREATE INDEX idx_organization_admins_org ON organization_admins(organization_id);
CREATE INDEX idx_organization_admins_status ON organization_admins(status);
CREATE INDEX idx_organization_admins_role ON organization_admins(role);
CREATE INDEX idx_organization_admins_email ON organization_admins(email);

-- Admin Users
CREATE INDEX idx_admin_users_admin ON admin_users(admin_id);
CREATE INDEX idx_admin_users_org ON admin_users(organization_id);
CREATE INDEX idx_admin_users_status ON admin_users(status);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_department ON admin_users(department);
CREATE INDEX idx_admin_users_email ON admin_users(email);
```

## API Endpoints

### Organizations
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Organization Admins
- `GET /api/organizations/:orgId/admins` - List all admins for organization
- `POST /api/organizations/:orgId/admins` - Add admin to organization
- `GET /api/organizations/:orgId/admins/:adminId` - Get admin details
- `PUT /api/organizations/:orgId/admins/:adminId` - Update admin
- `DELETE /api/organizations/:orgId/admins/:adminId` - Remove admin from organization

### Admin Users
- `GET /api/organizations/:orgId/admins/:adminId/users` - List all users for admin
- `POST /api/organizations/:orgId/admins/:adminId/users` - Add user to admin
- `GET /api/organizations/:orgId/admins/:adminId/users/:userId` - Get user details
- `PUT /api/organizations/:orgId/admins/:adminId/users/:userId` - Update user
- `DELETE /api/organizations/:orgId/admins/:adminId/users/:userId` - Remove user from admin

### Hierarchy
- `GET /api/organizations/:orgId/hierarchy` - Get complete organization hierarchy

## Example Queries

### Get complete hierarchy for an organization
```sql
WITH org_admins AS (
  SELECT * FROM organization_admins
  WHERE organization_id = :orgId
),
admin_users AS (
  SELECT au.* FROM admin_users au
  JOIN org_admins oa ON au.admin_id = oa.id
)
SELECT
  o.*,
  json_agg(
    json_build_object(
      'admin', oa.*,
      'users', (
        SELECT json_agg(au.*)
        FROM admin_users au
        WHERE au.admin_id = oa.id
      )
    )
  ) AS admins
FROM organizations o
LEFT JOIN org_admins oa ON o.id = oa.organization_id
WHERE o.id = :orgId
GROUP BY o.id;
```

### Get all users for an organization (across all admins)
```sql
SELECT au.* FROM admin_users au
JOIN organization_admins oa ON au.admin_id = oa.id
WHERE oa.organization_id = :orgId;
```

### Get admin count per organization
```sql
SELECT
  o.id,
  o.name,
  COUNT(oa.id) AS admin_count,
  SUM(
    SELECT COUNT(*)
    FROM admin_users au
    WHERE au.admin_id = oa.id
  ) AS user_count
FROM organizations o
LEFT JOIN organization_admins oa ON o.id = oa.organization_id
GROUP BY o.id;
```

## Migration Notes

1. If integrating with an existing users system, modify the schema to reference existing user IDs
2. Add appropriate constraints based on business requirements
3. Consider adding soft delete functionality instead of hard deletes
4. Add audit logging for administrative changes
5. Implement proper indexing for performance optimization

## Security Considerations

1. Ensure proper authentication and authorization for all API endpoints
2. Implement rate limiting for sensitive operations
3. Use prepared statements to prevent SQL injection
4. Implement proper error handling and logging
5. Consider adding row-level security for multi-tenant environments