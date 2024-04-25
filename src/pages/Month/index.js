import { DatePicker, NavBar } from "antd-mobile"
import './index.scss'
import { useEffect, useMemo, useState } from "react"
import classNames from "classnames"
import dayjs from "dayjs"
import { useSelector } from "react-redux"
import _ from "lodash"
import DaillyBill from "./components/DayBill"
const Month = () => {
    // 按月做数据分组
    const billList = useSelector(state => state.bill.billList)

    const monthGroup = useMemo(() => {
        //return出去计算之后的值
        const groupDate = _.groupBy(billList, (item) => dayjs(item.date).format('YYYY-MM'))
        return groupDate
    }, [billList])

    const [currentMonthList, setCurrentMonthList] = useState([])

    const monthResult = useMemo(() => {
        // 判断currentMonthList是否有值
        if (!Array.isArray(currentMonthList)) {
            return { pay: 0, income: 0, total: 0 }; // 如果 currentMonthList 不是数组，返回默认值
        }
        // 支出 / 收入 /结余
        const pay = currentMonthList.filter(item => item.type === 'pay').reduce((a, c) => a + c.money, 0)
        const income = currentMonthList.filter(item => item.type === 'income').reduce((a, c) => a + c.money, 0)

        return {
            pay,
            income,
            total: pay + income
        }
    }, [currentMonthList])

    // 初始化时将当前月的统计数据显示出来
    useEffect(() => {
        const nowDate = dayjs().format('YYYY-MM')
        if (monthGroup[nowDate]) {
            setCurrentMonthList(monthGroup[nowDate])
        }
    }, [monthGroup])
    // 控制弹框的打开和关闭
    const [dateVisible, setDateVisible] = useState(false)

    // 确认回调
    const onConfirm = (date) => {
        setDateVisible(false)
        // 其他逻辑
        const formatDate = dayjs(date).format('YYYY-MM')
        setCurrentMonthList(monthGroup[formatDate])
        setCurrentDate(formatDate)

    }

    const dayGroup = useMemo(() => {
        //return出去计算之后的值
        const groupData = _.groupBy(currentMonthList, (item) => dayjs(item.date).format('YYYY-MM-DD'))
        const keys = Object.keys(groupData).sort((a, b) => dayjs(a).isBefore(b) ? -1 : 1) // 根据日期排序
        return {
            groupData,
            keys
        }
    }, [currentMonthList])

    // 控制时间显示
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs(new Date()).format('YYYY-MM')
    })

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收支
            </NavBar>
            <div className="content">
                <div className="header">
                    {/* 时间切换区域 */}
                    <div className="date" onClick={() => setDateVisible(true)}>
                        <span className="test">

                            {currentDate + ''}月账单
                        </span>
                        {/* 根据当前弹窗打开的状态控制expend类名是否存在 */}
                        <span className={classNames('arrow', dateVisible && 'expand')}></span>
                    </div>
                    {/* 统计区域 */}
                    <div className="twoLineOverview">
                        <div className="item">
                            <span className="money">{monthResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                    <DatePicker
                        className="kaDate"
                        title="记账日期"
                        precision="month"
                        visible={dateVisible}
                        onClose={() => setDateVisible(false)}
                        onConfirm={onConfirm}
                        max={new Date()}
                    />
                </div>
                {/* 单日列表统计 */}
                {dayGroup.keys.length > 0 ? (
                    // 当有日期数据时，渲染账单列表
                    dayGroup.keys.map(key => (
                        <DaillyBill key={key} date={key} billList={dayGroup.groupData[key]} />
                    ))
                ) : (
                    // 当没有日期数据时，显示提示消息
                    <p>本月没有收支情况</p>
                )}
            </div>
        </div>
    )
}
export default Month