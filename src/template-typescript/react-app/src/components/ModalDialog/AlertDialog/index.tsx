import * as React from 'react'
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import styles from './index.module.scss';
import Icon from 'src/components/Icon';

/**
 * 使用Antd Modal.method()创建Modal无法获取到context和redux，所以这里要支持国际化需要重新调用一下IntlContainer
 * https://ant.design/components/modal-cn/#FAQ
 */
// const style = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }
// function RenderWithIntl(props) {
// 	return <IntlContainer>
// 		<div style={style}>
// 			{props.children}
// 		</div>
// 	</IntlContainer>
// }

interface Prop {
	title?: string | React.ReactNode;
	text?: string | React.ReactNode;
	textArray?: string[];
	textAlign?: 'left' | 'center' | 'right';
	onClose?: (...args: any[]) => any;
}
class AlertDialog extends React.PureComponent<Prop, {}>
{
	private onClick = () => {
		this.props.onClose && this.props.onClose()
	}
	render() {
		const { text, textArray, textAlign } = this.props
		return (
			<section className={`${styles.dialogContent}`}>
				<section className={styles.header}>
					{this.props.title || <div />}
					<Icon width={16} name="icon-close-16-x-16" pointer onClick={this.onClick} />
				</section>
				<section className={styles.content} style={{ textAlign: textAlign || 'center' }}>
					{
						text ? <span>{text}</span> : null
					}

					{
						textArray ? textArray.map((item, index) => <span key={index}>{item}</span>) : null
					}
				</section>
			</section>
		)
	}
}

export interface IAlertDialogOptions extends ModalFuncProps {
	key?: string, // 设置了key的dialog同一时间只能弹出一个
	text?: string | React.ReactNode;
	textArray?: string[];
	textAlign?: 'left' | 'center' | 'right';
	buttonType?: 'confirm' | 'info' | 'warn'; // confirm显示两个按钮， info显示一个按钮， 默认为confirm
	onClose?: (...args: any[]) => any;
}
const alertDialogKeys = {}
export function showAlertDialog(options: IAlertDialogOptions) {
	const { title, ...other } = options
	const key = options.key || new Date().getTime().toString()
	const { confirm, info, warn } = Modal;
	const modalMethod = options.buttonType === 'info' ? info : options.buttonType === 'warn' ? warn : confirm
	const okText = options.okText
	const cancelText = options.cancelText
	let _modal: any = null
	const onClose = () => {
		delete alertDialogKeys[key]
		_modal && _modal.destroy();
		options.onClose && options.onClose()
	}
	if (!alertDialogKeys[key]) {
		alertDialogKeys[key] = key
		_modal = modalMethod({
			...other,
			icon: null,
			className: styles.alertDialog,
			centered: true,
			maskClosable: false,
			content: <AlertDialog title={title} text={options.text} textArray={options.textArray} textAlign={options.textAlign} onClose={onClose} />,
			width: options.width || 480,
			okText,
			cancelText,
		})
	}
}

export default showAlertDialog