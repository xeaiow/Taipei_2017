# 2017 臺北世界大學運動會器材檢核及回報系統

## 功能
* 工作人員管理
* 器材項目管理
* 簽到簽退管理
* 場館管理
* 器材驗收單
* 異常通知
* 公告通知

## 使用技術
* Laravel
* Bootstrap
* Ionic (APP)
* MySQL

## 安裝方法 (以 XAMPP 為例)
1. 將檔案放至 C:\xampp\htdocs 中
2. 將下列內容新增至 C:\xampp\apache\conf\extra 的 httpd-vhosts.conf 中
```
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/tsu/public"
    ServerAdmin seminar.app.com
    <Directory "C:/xampp/htdocs/tsu/public">
        AllowOverride All
    </Directory>
</VirtualHost>
```
3. 透過 XAMPP Control Panel 進入 phpMyAdmin，新增名稱為「tsu」的資料庫
4. 匯入資料 DB.sql 檔案


---

### 主控台
![](https://i.imgur.com/LgL8gKV.png)

### 注意事項公告
![](https://i.imgur.com/RiasCEY.png)

### 工作人員管理
![](https://i.imgur.com/ewe3KeG.png)

### 驗收單
![](https://i.imgur.com/yqN11Cx.png)

### 驗收單細節
![](https://i.imgur.com/gAoUTJH.png)

### 器材異常通知
![](https://i.imgur.com/xIKyqk0.png)

### 簽到/簽退紀錄
![](https://i.imgur.com/OtLy8YH.png)

### 器材項目管理
![](https://i.imgur.com/5dOKANH.png)

### 場館管理
![](https://i.imgur.com/jccm5cS.png)

