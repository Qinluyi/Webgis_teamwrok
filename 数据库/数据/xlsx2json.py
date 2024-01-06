import pandas as pd
import json

# 读取Excel文件
excel_file = "D:/study/网络GIS/xiaozu/xiupin.xlsx"
df = pd.read_excel(excel_file)

# 将每一行数据转换为JSON格式并写入txt文件
json_list = []
for index, row in df.iterrows():
    course_data = {
        "OBJECTID": int(row["OBJECTID"]),
        "ID": int(row["ID"]),
        "发布者I": str(row["发布者I"]),
        "寓意": str(row["寓意"]),
        "经度": float(row["经度"]),
    }
    json_list.append(course_data)

# 写入JSON数据到txt文件
with open("D:/study/网络GIS/xiaozu/绣品.txt", "w", encoding="utf-8") as json_file:
    json.dump(json_list, json_file, ensure_ascii=False, indent=2)
