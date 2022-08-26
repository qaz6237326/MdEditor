import {Icon, Message, Modal, Tooltip, Image} from "@arco-design/web-react"
import {useRef, useState} from "react"
import {CopyToClipboard, defaultStyle, emitter, EventType} from "@/utils"
import "@/style/editor/index.less"
import juice from "juice"
import {ZhiHuIcon} from "@/components/icons/zhihu"
import {WeXinIcon} from "@/components/icons/weixin";
import {Computer, Iphone, PayCodeOne, UpdateRotation} from "@icon-park/react"
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {QRCodeCanvas} from 'qrcode.react';
import {useSearchParams} from "react-router-dom";
// import  "highlight.js/styles/atom-one-light.css"
// const IconFont = Icon.addFromIconFontCn({src: '//at.alicdn.com/t/font_3408739_o2okt6dixt.js'})
type Props = {
    tool: boolean,
    content: string
}
export default function Preview(props: Props) {
    const preview = useRef(null)
    const [searchParams] = useSearchParams();

    const [DeviceType, setDeviceType] = useState('icon-pc')
    const articleDetail = useSelector((state: RootState) => state.articleDetail);
    const [visible, setVisible] = useState(false)
    emitter.on(EventType.Scroll, (val: any) => {
        // console.log("滚动高度", val)
        let scrollView = document.getElementById("scroll") as unknown as HTMLElement
        scrollView.scrollTop = val * 0.8
    })
    const IconList = [
        {
            id: 1,
            icon: <ZhiHuIcon/>,
            title: "复制到知乎",
            type: "icon-zhihu"
        },
        {
            id: 2,
            icon: <WeXinIcon/>,
            title: "复制到微信公众号",
            type: "icon-wx"
        },
        {
            id: 3,
            icon: <Computer theme="outline" size="20" fill="#333" strokeWidth={3}/>,
            type: 'icon-pc',
            title: "电脑端样式预览"
        },
        {
            id: 4,
            icon: <Iphone theme="outline" size="20" fill="#333" strokeWidth={3}/>,
            type: 'icon-phone',
            title: "手机端样式预览"
        },
        // {
        //     id: 5,
        //     icon: <UpdateRotation theme="outline" size="20" fill="#333" strokeWidth={3}/>,
        //     type: 'icon-sync'
        // }
        {
            id: 6,
            icon: <PayCodeOne theme="outline" size="20" fill="#333" strokeWidth={3}/>,
            type: 'icon-code',
            title: "手机扫码预览"
        }
    ]
    const IconClick = async (id: number) => {
        switch (id) {
            case 1:
                Message.info("暂未支持!敬请期待!")
                break;
            case 2:
                //@ts-ignore
                let res = juice.inlineContent(preview.current.innerHTML, defaultStyle, {
                    inlinePseudoElements: true,
                    preserveImportant: true,
                })
                await CopyToClipboard(res)
                Message.success("复制成功!去微信公众号编辑器粘贴吧!")
                break;
            case 3:
                setDeviceType('icon-phone')
                break;
            case 4:
                setDeviceType('icon-pc')
                break;
            case 5:
                console.log(articleDetail, "文章详情")
                //@ts-ignore
                window.syncPost({
                    title: articleDetail.title,
                    // desc:articleDetail.desc,
                    content: articleDetail.md_content,
                    thumb: articleDetail.thumbnail,
                })
                break;
            case 6:
                if (searchParams.get("id") && searchParams.get("id") != "add") {
                    setVisible(true)
                } else {
                    Message.info("这不是一篇发布的文章,暂时不可以预览!")
                }
                break;
            default:
                break;
        }
    }
    const EditorClass = () => {
        if (DeviceType === 'icon-phone') {
            return 'md-editor md-editor-pc scroll-bar'
        } else {
            return 'md-editor md-editor-phone scroll-bar'
        }
    }
    return (
        <div className={"md-preview"}>
            {
                props.tool && <div className={"tool"}>
                    {
                        IconList.map((item: any) => {
                            if (item.id === 1 || item.id === 2 || item.id === 5 || item.id === 6 || item.type === DeviceType) {
                                return (
                                    <span className="tool-icon" onClick={() => IconClick(item.id)}>
                                          <Tooltip position='lt' trigger='hover' content={item.title}>
                                              {item.icon}
                                          </Tooltip>
                                </span>
                                )
                            }
                        })
                    }
                </div>
            }
            <section ref={preview} className={"md-preview-content"} id="scroll" data-tool={"mdEditor"}>
                <section className={EditorClass()}>
                    <span>
                         <div style={{paddingBottom: "100px"}} dangerouslySetInnerHTML={{
                             __html: props.content,
                         }}>
                    </div>
                    </span>
                </section>
            </section>
            <Modal
                title='手机扫码预览'
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                autoFocus={false}
                focusLock={true}
            >
                <div style={{textAlign: "center"}}>
                    <QRCodeCanvas value={"https://www.uvdream.cn/editor/#/preview?id=" + searchParams.get("id")}/>
                </div>
            </Modal>
        </div>
    )
}
