import { NavBar, DatePicker } from "antd-mobile"
import { useMemo, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import './index.scss'
import dayjs from "dayjs"
import classNames from "classnames"
import _ from "lodash"
import { useNavigate } from "react-router-dom"
import MonliyBill from "./components/MonthBill"
const Year = () => {
    const navigate = useNavigate()
    // 按月做数据分组
    const billList = useSelector(state => state.bill.billList)

    // 年
    const [currentYearList, setCurrentYearList] = useState([])

    const yearGroup = useMemo(() => {
        //return出去计算之后的值
        const groupData = _.groupBy(billList, (item) => dayjs(item.date).format('YYYY'))
        const keys = Object.keys(groupData)
        return {
            groupData,
            keys
        }
    }, [billList])

    const monthGroup = useMemo(() => {
        //return出去计算之后的值
        const monthDate = _.groupBy(currentYearList, (item) => dayjs(item.date).format('M'))
        const monthkeys = Object.keys(monthDate)
        return {
            monthDate,
            monthkeys
        }
    }, [currentYearList])

    // // 初始化时将当前月的统计数据显示出来
    useEffect(() => {
        const nowDate = dayjs().format('YYYY')
        if (yearGroup.groupData[nowDate]) {
            setCurrentYearList(yearGroup.groupData[nowDate])
        }
    }, [yearGroup.groupData])



    const YearResult = useMemo(() => {
        // 判断currentMonthList是否有值
        if (!Array.isArray(currentYearList)) {
            return { pay: 0, income: 0, total: 0 }; // 如果 currentYearhList 不是数组，返回默认值
        }
        // 支出 / 收入 /结余
        const pay = currentYearList.filter(item => item.type === 'pay').reduce((a, c) => a + c.money, 0)
        const income = currentYearList.filter(item => item.type === 'income').reduce((a, c) => a + c.money, 0)

        return {
            pay,
            income,
            total: pay + income
        }
    }, [currentYearList])

    // 控制弹框的打开和关闭
    const [dateVisible, setDateVisible] = useState(false)

    // 确认回调
    const onConfirm = (date) => {
        setDateVisible(false)
        // 其他逻辑
        const formatDate = dayjs(date).format('YYYY')
        setCurrentDate(formatDate)
        setCurrentYearList(yearGroup.groupData[[formatDate]])
        console.log(currentYearList)
    }

    // 控制时间显示
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs(new Date()).format("YYYY")
    })

    return (
        <div className="billDetail">
            <NavBar className="nav" onBack={() => navigate(-1)}>
                <div className="nav-title">
                    {currentDate}年
                    <span className={classNames('arrow', dateVisible && 'expand')} onClick={() => setDateVisible(!dateVisible)}></span>
                </div>
            </NavBar>
            <DatePicker
                className="kaDate"
                title="记账日期"
                precision="year"
                visible={dateVisible}
                max={new Date()}
                onConfirm={onConfirm}
                onClose={() => setDateVisible(false)}
            />

            <div className="content">
                <div className="overview">
                    <div className='twoLineOverview'>
                        <div className="item">
                            <span className="money">{YearResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{YearResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{YearResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                </div>
                {/* 单月列表统计 */}
                {monthGroup.monthkeys.length > 0 ? (
                    // 当有日期数据时，渲染账单列表
                    monthGroup.monthkeys.map(key => (
                        <MonliyBill key={key} date={key} billList={monthGroup.monthDate[key]} />
                    ))
                ) : (
                    // 当没有日期数据时，显示提示消息
                    <p>本年没有收支情况</p>
                )}
            </div>
        </div>
    )
}
export default Year