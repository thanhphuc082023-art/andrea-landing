# MCP Figma Server

MCP (Model Context Protocol) server để tích hợp Figma API với Augment Code, cho phép truy cập và làm việc với design files trực tiếp từ AI assistant.

## 🚀 Tính năng

- ✅ Truy cập Figma files qua API
- ✅ Lấy thông tin components và component sets
- ✅ Tìm kiếm component theo tên
- ✅ Trích xuất styles và design tokens
- ✅ Tích hợp với Augment Code

## 📦 Cài đặt

Package này đã được cài đặt sẵn trong monorepo. Để chạy từ root project:

```bash
# Chạy MCP Figma server
pnpm mcp:figma

# Hoặc chạy trong development mode
pnpm mcp:figma:dev
```

## ⚙️ Cấu hình

1. **Tạo file `.env`** từ template:
   ```bash
   cp packages/mcp-figma/.env.example packages/mcp-figma/.env
   ```

2. **Cấu hình environment variables**:
   ```env
   # Figma Personal Access Token
   # Lấy từ: https://www.figma.com/developers/api#access-tokens
   FIGMA_TOKEN=your_figma_personal_access_token_here
   
   # Figma File ID
   # Lấy từ URL: https://www.figma.com/file/FILE_ID/file-name
   FIGMA_FILE_ID=your_figma_file_id_here
   
   # MCP Server Port (tùy chọn, mặc định 3000)
   MCP_PORT=3000
   ```

3. **Lấy Figma Personal Access Token**:
   - Đăng nhập vào Figma
   - Vào Settings → Account → Personal access tokens
   - Tạo token mới với quyền truy cập cần thiết

4. **Lấy Figma File ID**:
   - Mở file Figma trong browser
   - Copy ID từ URL: `https://www.figma.com/file/[FILE_ID]/file-name`

## 🔧 Tích hợp với Augment Code

1. **Mở Augment Code → Workspace Settings → MCP**

2. **Thêm MCP server mới**:
   - **Name**: `figma`
   - **Command**: `node packages/mcp-figma/figma-mcp-server.js`

3. **Thêm Environment Variables**:
   - `FIGMA_TOKEN`: your_figma_token
   - `FIGMA_FILE_ID`: your_file_id
   - `MCP_PORT`: 3000

4. **Save và toggle ON** server "figma"

5. **Kiểm tra logs** để đảm bảo server chạy thành công:
   ```
   MCP Figma Server running on port 3000
   Connected to Figma file: your_file_id
   ```

## 💬 Cách sử dụng

Sau khi tích hợp thành công, bạn có thể sử dụng các prompt sau trong Augment Code:

### Lấy toàn bộ file data
```
Sử dụng figma tool để lấy toàn bộ thông tin file design.
```

### Lấy danh sách components
```
Dùng figma tool với action get_components để xem tất cả components trong file.
```

### Tìm component cụ thể
```
Sử dụng figma tool với action get_component_details và component_name "ButtonPrimary" để lấy chi tiết component.
```

### Lấy styles
```
Dùng figma tool với action get_styles để xem tất cả styles được sử dụng.
```

## 🛠️ API Actions

MCP Figma server hỗ trợ các actions sau:

- `get_file` (mặc định): Lấy toàn bộ file data
- `get_components`: Lấy danh sách tất cả components
- `get_component_details`: Lấy chi tiết component theo tên
- `get_styles`: Lấy thông tin styles

## 🔍 Troubleshooting

### Server không khởi động
- Kiểm tra `FIGMA_TOKEN` và `FIGMA_FILE_ID` đã được cấu hình đúng
- Đảm bảo token có quyền truy cập file

### Không tìm thấy component
- Kiểm tra tên component có chính xác không (không phân biệt hoa thường)
- Component phải là type `COMPONENT` hoặc `COMPONENT_SET`

### Lỗi kết nối Figma API
- Kiểm tra token còn hiệu lực
- Đảm bảo file ID đúng và có quyền truy cập

## 📝 Logs

Server sẽ ghi logs khi:
- Khởi động thành công
- Kết nối với Figma file
- Xảy ra lỗi trong quá trình xử lý

Kiểm tra logs trong Augment Code MCP settings để debug các vấn đề.
