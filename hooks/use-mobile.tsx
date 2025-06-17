import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mqlMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const mqlTablet = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
// 原代码中 mql 未定义，推测需要监听移动端和桌面端的媒体查询变化
mqlMobile.addEventListener("change", onChange);
mqlTablet.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
// 原代码中 mql 未定义，这里应该移除移动端和桌面端媒体查询的事件监听
return () => {
  mqlMobile.removeEventListener("change", onChange);
  mqlTablet.removeEventListener("change", onChange);
}
  }, [])

  return !!isMobile
}
