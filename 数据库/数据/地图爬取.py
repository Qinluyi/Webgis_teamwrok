import requests
import pandas as pd

# 构建表头
header = [['province', 'city', 'area', 'address','name', 'lng', 'lat']]
out = pd.DataFrame(header)
save_path = '黔东南苗族侗族自治州湿地位置数据16.csv'
out.to_csv(save_path, mode='a', header=False,index=False, encoding='gbk')

# 构建请求并计算所需页码
query = '苗绣合作社'  # 检索关键字
region = '黔西南州'  # 检索行政区划区域（增加区域内数据召回权重，如需严格限制召回数据在区域内，请搭配使用city_limit参数）
city_limit = 'true'  # 区域数据召回限制，为true时，仅召回region对应区域内数据。
page_size = '20'  # 单次召回POI数量，默认为10条记录，最大返回20条。
page_num = '0'  # 分页页码，默认为0,0代表第一页
ak = '0DUhptPkPi3VDm4Ynm2LAlGj4GiIoW7L'

url = f'https://api.map.baidu.com/place/v2/search?query={query}&region={region}&city_limit={city_limit}&' \
      f'page_size={page_size}&page_num={page_num}&coord_type=1&output=json&ak={ak}'

html = requests.get(url)  # 获取url
data = html.json()  # 通过json()解析数据
html.close()  # 关闭网页链接
count = data['total']
page_total = int(count/20)+1

# 保存结果
num = 0  # 计数器
try:
    for page_num in range(page_total):
        url = f'https://api.map.baidu.com/place/v2/search?query={query}&region={region}&city_limit={city_limit}&' \
              f'page_size={page_size}&page_num={page_num}&coord_type=1&output=json&ak={ak}'

        html = requests.get(url)  # 获取url
        data = html.json()  # 通过json()解析数据
        html.close()  # 关闭网页链接
        for i in range(20):
            province = data['results'][i]['province']
            city = data['results'][i]['city']
            area = data['results'][i]['area']
            address=data['results'][i]['address']
            name = data['results'][i]['name']
            lng = data['results'][i]['location']['lng']
            lat = data['results'][i]['location']['lat']
            information = [[province, city, area,address,name, lng, lat]]
            out = pd.DataFrame(information)
            out.to_csv(save_path, mode='a', header=False,index=False, encoding='gbk')
            num = num + 1
            print('当前获取第' + str(num) + '条数据中。')
except Exception as e:
    print('获取完成')
    print('结束代码：', str(e))