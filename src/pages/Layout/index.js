import { getBillList } from "@/store/modules/billStore"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useLocation } from "react-router-dom"
import './index.scss'
import { TabBar } from "antd-mobile"
import { useNavigate } from "react-router-dom"
import {
    BillOutline,
    CalculatorOutline,
    AddCircleOutline
} from 'antd-mobile-icons'
const tabs = [
    {
        key: '/month',
        title: '月度账单',
        icon: <BillOutline />
    },
    {
        key: '/new',
        title: '记账',
        icon: <AddCircleOutline />
    },
    {
        key: '/year',
        title: '年度账单',
        icon: <CalculatorOutline />
    }
]


const Layout = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const switchRoute = (path) => {
        navigate(path)
    }
    useEffect(() => {
        dispatch(getBillList())
    }, [dispatch])

    return (
        <div className="layout">
            <div className="container">
                <Outlet />
            </div>
            <div className="footer">
                <TabBar onChange={switchRoute} activeKey={location.pathname} >
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} title={item.title} icon={item.icon} />
                    ))}
                </TabBar>
            </div>
        </div>
    )
}
export default Layout