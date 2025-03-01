# 作业助手API文档

## 基础URL
```
http://localhost:3000/api
```

## 身份验证
大多数端点需要JWT身份验证。在请求头中包含JWT令牌：
```
Authorization: Bearer {your_jwt_token}
```

## 目录
- [账户](#account)
- [课程作业](#coursework)
- [辅导](#tutorial)

---

## 账户

### 注册
创建新用户账户。

- **URL**: `/account/register`
- **方法**: `POST`
- **身份验证要求**: 否
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "student | teacher"
  }
  ```
- **成功响应**: 
  - **代码**: 201 Created
  - **内容**: 
    ```json
    {
      "token": "jwt_token_string"
    }
    ```
- **错误响应**:
  - **代码**: 400 Bad Request (缺少字段或用户已存在)
  - **代码**: 500 Server Error

### 登录
验证用户并获取JWT令牌。

- **URL**: `/account/login`
- **方法**: `POST`
- **身份验证要求**: 否
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 
    ```json
    {
      "token": "jwt_token_string"
    }
    ```
- **错误响应**:
  - **代码**: 400 Bad Request (缺少字段)
  - **代码**: 401 Unauthorized (无效凭证)
  - **代码**: 500 Server Error

### 更新用户信息
更新已验证用户的个人信息。

- **URL**: `/account/info`
- **方法**: `PUT`
- **身份验证要求**: 是
- **请求体** (所有字段可选):
  ```json
  {
    "gender": "string",
    "contactInfo": "string", 
    "enrollmentYear": "YYYY-MM-DD",
    "college": "string",
    "major": "string"
  }
  ```
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 
    ```json
    {
      "message": "User information updated successfully"
    }
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 404 Not Found (用户未找到)
  - **代码**: 500 Server Error

### 更新头像
上传或更新用户的个人头像。

- **URL**: `/account/avatar`
- **方法**: `PUT`
- **身份验证要求**: 是
- **Content-Type**: `multipart/form-data`
- **请求体**:
  - `avatar`: 图像文件
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 
    ```json
    {
      "avatarUrl": "/uploads/filename.jpg"
    }
    ```
- **错误响应**:
  - **代码**: 400 Bad Request (未上传文件)
  - **代码**: 401 Unauthorized
  - **代码**: 404 Not Found (用户未找到)
  - **代码**: 500 Server Error

### 获取用户信息
获取当前用户的个人信息。

- **URL**: `/account/info`
- **方法**: `GET`
- **身份验证要求**: 是
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 
    ```json
    {
      "gender": "string",
      "contactInfo": "string",
      "enrollmentYear": "YYYY-MM-DDT00:00:00.000Z",
      "college": "string",
      "major": "string",
      "avatarUrl": "/uploads/filename.jpg"
    }
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 404 Not Found (用户未找到)
  - **代码**: 500 Server Error

---

## 课程作业

### 上传课程作业图像
上传课程作业的图像。

- **URL**: `/coursework/image`
- **方法**: `POST`
- **身份验证要求**: 是
- **Content-Type**: `multipart/form-data`
- **请求体**:
  - `image`: 图像文件
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 
    ```json
    {
      "imageUrl": "/uploads/filename.jpg"
    }
    ```
- **错误响应**:
  - **代码**: 400 Bad Request (未上传文件或文件类型无效)
  - **代码**: 401 Unauthorized
  - **代码**: 500 Server Error

### 上传课程作业（学生）
创建新的课程作业请求。

- **URL**: `/coursework`
- **方法**: `POST`
- **身份验证要求**: 是 (仅限学生角色)
- **请求体**:
  ```json
  {
    "imageUrls": ["string"],
    "content": "string",
    "subject": "string",
    "priceRange": {
      "min": number,
      "max": number
    },
    "deadline": "YYYY-MM-DDTHH:MM:SS.SSSZ",
    "tags": ["string"]
  }
  ```
- **成功响应**: 
  - **代码**: 201 Created
  - **内容**: 
    ```json
    {
      "id": "coursework_id_string"
    }
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是学生)
  - **代码**: 500 Server Error

### 获取课程作业列表（学生）
获取学生创建的课程作业列表。

- **URL**: `/coursework/student`
- **方法**: `GET`
- **身份验证要求**: 是 (仅限学生角色)
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 课程作业对象数组 (不包括 content 和 imageUrls):
    ```json
    [
      {
        "_id": "string",
        "subject": "string",
        "priceRange": {
          "min": number,
          "max": number
        },
        "deadline": "YYYY-MM-DDTHH:MM:SS.SSSZ",
        "tags": ["string"],
        "status": "pending | completed",
        "createdAt": "YYYY-MM-DDTHH:MM:SS.SSSZ",
        "updatedAt": "YYYY-MM-DDTHH:MM:SS.SSSZ"
      }
    ]
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是学生)
  - **代码**: 500 Server Error

### 获取课程作业详情（学生）
获取特定课程作业的详细信息。

- **URL**: `/coursework/student/:id`
- **方法**: `GET`
- **身份验证要求**: 是 (仅限学生角色)
- **URL 参数**: `id` - 课程作业ID
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 完整的课程作业对象，包括解决方案（如果有）
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是学生)
  - **代码**: 404 Not Found (课程作业未找到)
  - **代码**: 500 Server Error

### 获取课程作业列表（教师）
获取教师可用的待处理课程作业列表。

- **URL**: `/coursework/teacher`
- **方法**: `GET`
- **身份验证要求**: 是 (仅限教师角色)
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 课程作业对象数组 (不包括 content 和 imageUrls)
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是教师)
  - **代码**: 500 Server Error

### 获取课程作业详情（教师）
获取特定课程作业的详细信息。

- **URL**: `/coursework/teacher/:id`
- **方法**: `GET`
- **身份验证要求**: 是 (仅限教师角色)
- **URL 参数**: `id` - 课程作业ID
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 完整的课程作业对象
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是教师)
  - **代码**: 404 Not Found (课程作业未找到)
  - **代码**: 500 Server Error

### 完成课程作业（教师）
提交课程作业的解决方案。

- **URL**: `/coursework/complete/:id`
- **方法**: `PUT`
- **身份验证要求**: 是 (仅限教师角色)
- **URL 参数**: `id` - 课程作业ID
- **请求体**:
  ```json
  {
    "imageUrls": ["string"],
    "description": "string"
  }
  ```
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 
    ```json
    {
      "message": "Coursework completed successfully"
    }
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是教师)
  - **代码**: 404 Not Found (课程作业未找到)
  - **代码**: 500 Server Error

---

## 辅导

### 创建辅导请求（学生）
创建新的辅导请求。

- **URL**: `/tutorial`
- **方法**: `POST`
- **身份验证要求**: 是 (仅限学生角色)
- **请求体**:
  ```json
  {
    "school": "string",
    "major": "string",
    "course": "string",
    "content": "string"
  }
  ```
- **成功响应**: 
  - **代码**: 201 Created
  - **内容**: 
    ```json
    {
      "message": "Tutorial request created successfully"
    }
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是学生)
  - **代码**: 500 Server Error

### 获取辅导请求（学生）
获取学生创建的辅导请求。

- **URL**: `/tutorial/student`
- **方法**: `GET`
- **身份验证要求**: 是 (仅限学生角色)
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 辅导对象数组:
    ```json
    [
      {
        "_id": "string",
        "school": "string",
        "major": "string",
        "course": "string",
        "content": "string",
        "status": "open | matched | completed",
        "arrangement": "string",
        "createdAt": "YYYY-MM-DDTHH:MM:SS.SSSZ",
        "updatedAt": "YYYY-MM-DDTHH:MM:SS.SSSZ"
      }
    ]
    ```
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是学生)
  - **代码**: 500 Server Error

### 获取匹配的辅导请求（教师）
获取与教师专业匹配的开放辅导请求。

- **URL**: `/tutorial/teacher`
- **方法**: `GET`
- **身份验证要求**: 是 (仅限教师角色)
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 辅导对象数组
- **错误响应**:
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是教师)
  - **代码**: 500 Server Error

### 接受辅导请求（教师）
接受辅导请求并提供安排详情。

- **URL**: `/tutorial/accept/:id`
- **方法**: `PUT`
- **身份验证要求**: 是 (仅限教师角色)
- **URL 参数**: `id` - 辅导ID
- **请求体**:
  ```json
  {
    "arrangement": "string"
  }
  ```
- **成功响应**: 
  - **代码**: 200 OK
  - **内容**: 更新后的可用辅导对象数组
- **错误响应**:
  - **代码**: 400 Bad Request (辅导请求不可用)
  - **代码**: 401 Unauthorized
  - **代码**: 403 Forbidden (不是教师)
  - **代码**: 404 Not Found (辅导未找到)
  - **代码**: 500 Server Error

---

## 错误响应

所有端点都可能返回以下常见错误响应：

- **401 Unauthorized**:
  ```json
  {
    "message": "No authentication token, access denied"
  }
  ```
  或
  ```json
  {
    "message": "Invalid token, authorization denied"
  }
  ```

- **403 Forbidden**:
  ```json
  {
    "message": "Access denied, insufficient permissions"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "message": "Resource not found"
  }
  ```

- **500 Server Error**:
  ```json
  {
    "message": "Server error"
  }
  ```

## 文件上传限制

- 最大文件大小: 10MB
- 支持的图像格式: JPEG, JPG, PNG, GIF