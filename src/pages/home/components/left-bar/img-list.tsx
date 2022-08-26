import {Button, Empty, Grid, Image, Message, Modal, Pagination, Upload} from "@arco-design/web-react";
import {useEffect, useState} from "react";
import {fileType, Props} from "./index.d";
import {ResponseType} from "@/utils/request";
import Config from "@/config";
import {Copy, DeleteOne, PreviewOpen} from "@icon-park/react";
import {CopyToClipboard} from "@/utils";
import {deleteFile__openAPI__deleteId, getFileList} from "@/services/api/file";
import config from "@/config";
import {UploadItem} from "@arco-design/web-react/es/Upload";

const Row = Grid.Row;
const Col = Grid.Col;
export default function ImgList(props: Props) {
    const [imgList, setImgList] = useState<Array<fileType>>([]);
    const [options, setOptions] = useState({
        page: 1,
        page_size: 16
    })
    const [total, setTotal] = useState(0)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [currentPreview, setCurrentPreview] = useState(1)
    useEffect(() => {
        getImgList().then()
    }, [])

    const getImgList = async () => {
        const res: ResponseType = await getFileList(options) as unknown as API.Response
        if (res.code === 200) {
            setImgList(res.data.list)
            setTotal(res.data.total)
        }
    }
    const deleteImg = async (id: number) => {
        //@ts-ignore
        const res = await deleteFile__openAPI__deleteId({id}) as unknown as API.Response
        if (res.code === 200) {
            Message.success("删除成功")
            getImgList().then()
        }
    }

    const uploadSuccess = (fileList: UploadItem[], file: any) => {
        if (file.response&&file.response.success) {
            if (file.response.data.position === "local") {
                CopyToClipboard("![" + file.response.data.name + "](" + config.baseURL + file.response.data.url + ")").then(r => {
                    Message.success("上传成功,已复制为Markdown链接")
                    getImgList().then()
                })
            }
        }
    }
    return (
        <Modal
            title="图片资源"
            style={{width: 800}}
            visible={props.visible}
            onCancel={() => {
                props.onOk && props.onOk()
            }}
            footer={
                <Button onClick={() => {
                    props.onOk && props.onOk()
                }}>关闭</Button>
            }
        >
            <div style={{marginBottom:10}}>
                <Upload
                    multiple
                    headers={{"x-token": localStorage.getItem('token')}}
                    accept='image/*'
                    showUploadList={false}
                    action={config.baseURL + '/file/upload'}
                    onChange={uploadSuccess}
                />
            </div>
            <Image.PreviewGroup infinite current={currentPreview}>
                {
                    imgList.length === 0 ? <Empty/> :
                        <Row gutter={24}>
                            {
                                imgList.map((item, index) => {
                                    return (
                                        <Col
                                            key={index}
                                            span={5}
                                            offset={1} style={{marginBottom: "10px"}}
                                        >
                                            <Image
                                                width={"100%"}
                                                height={120}
                                                previewProps={{
                                                    visible: previewVisible,
                                                    onVisibleChange: (e) => {
                                                        setPreviewVisible(false);
                                                    },
                                                }}
                                                onClick={() => {
                                                    setCurrentPreview(index)
                                                }}
                                                actions={[
                                                    <PreviewOpen
                                                        key="1"
                                                        theme="outline"
                                                        size="15"
                                                        fill="#333" strokeWidth={3}
                                                        onClick={() => {
                                                            setPreviewVisible(true);
                                                            setCurrentPreview(index);
                                                        }}
                                                    />,
                                                    <DeleteOne
                                                        key="2"
                                                        theme="outline"
                                                        size="15"
                                                        fill="#333"
                                                        strokeWidth={3}
                                                        onClick={() => {
                                                            deleteImg(item.id).then()
                                                        }}
                                                    />,
                                                    <Copy
                                                        theme="outline"
                                                        size="15"
                                                        fill="#333"
                                                        strokeWidth={3}
                                                        onClick={() => {
                                                            const text = `![](${Config.baseURL}${item.url})`
                                                            CopyToClipboard(text).then(() => {
                                                                Message.success("复制成功,去编辑器粘贴吧!")
                                                            })
                                                        }}
                                                    />
                                                ]}
                                                src={item.position == "local" ? Config.baseURL + item.url : item.url}
                                            />
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                }
            </Image.PreviewGroup>
            <div style={{textAlign: "center"}}>
                {
                    total != 0 && <Pagination
                        style={{margin: "0 auto", display: "inline-block"}}
                        total={total}
                        onChange={(page, pageSize) => {
                            options.page = page
                            options.page_size = pageSize
                            setOptions(options)
                            getImgList().then()
                        }}
                    />
                }

            </div>
        </Modal>
    )
}
