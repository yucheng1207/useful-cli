/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';

export interface IconProps {
	name: string;
	/**
	 * 是否携带交互，如果为true，则会在相应的交互状态下寻找对应的svg图片，例如：Normal状态:ic-test Hover状态:ic-test-hover Active状态: ic-test-active
	 */
	interactive?: boolean;
	className?: string;
	svgClassName?: string;
	disabled?: boolean;
	pointer?: boolean;
	width?: number | string;
	height?: number | string;
	onClick?: () => void;
	onMouseEnter?: () => void; // 确保 Tooltip 的子元素能接受 onMouseEnter、onMouseLeave、onFocus、onClick 事件
	onMouseLeave?: () => void;
}

const _Icon = (IconLocal: React.ReactType): React.StatelessComponent<IconProps> => (
	{ svgClassName, width, height }: IconProps
): React.ReactElement<IconProps> => {
	const element = <IconLocal />;
	const props: any = {
		className: 'meshIcon' + (svgClassName ? ` ${svgClassName}` : '')
	};
	if (width) props.width = typeof width === 'string' ? width : `${width}px`;
	if (height) props.height = typeof height === 'string' ? height : `${height}px`;
	return React.cloneElement(element, {
		...element.props,
		...props
	});
};

interface IDefaultProps {
	interactive?: boolean;
	disabled?: boolean;
	pointer?: boolean;
}

interface IState {
	name: string;
	isHover: boolean
	isActive: boolean
}

export class Icon extends React.Component<IconProps & IDefaultProps, IState> {
	constructor(props: IconProps & IDefaultProps) {
		super(props);
		this.state = {
			isActive: false,
			isHover: false,
			name: props.name
		}
		this.initIcon(props.name, props.interactive)
	}

	shouldComponentUpdate(nextProps: IconProps & IDefaultProps) {
		if (nextProps.name !== this.props.name) {
			this.initIcon(nextProps.name, nextProps.interactive)
		}
		return true
	}

	static defaultProps: IDefaultProps = {
		interactive: false,
		disabled: false,
		pointer: false,
	};

	private NormalIcon?: React.StatelessComponent<IconProps>
	private ActiveIcon?: React.StatelessComponent<IconProps>
	private HoverIcon?: React.StatelessComponent<IconProps>

	private initIcon(name: string, interactive?: boolean) {
		try {
			this.NormalIcon = _Icon(require(`../../images/icons/${name}.svg`));
			this.ActiveIcon = interactive ? _Icon(require(`../../images/icons/${name}-active.svg`)) : undefined;
			this.HoverIcon = interactive ? _Icon(require(`../../images/icons/${name}-hover.svg`)) : undefined;
		}
		catch (error) {
			console.error('Init Icon Failed:', error)
		}
	}

	private onMouseEnter = () => {
		this.setState({
			isHover: true
		})
		this.props.onMouseEnter && this.props.onMouseEnter()
	}

	private onMouseLeave = () => {
		this.setState({
			isHover: false,
			isActive: false
		})
		this.props.onMouseLeave && this.props.onMouseLeave()
	}

	private onMouseDown = () => {
		this.setState({
			isActive: true
		})
	}

	private onMouseUp = () => {
		this.setState({
			isActive: false
		})
	}

	private renderIcon = () => {
		const { interactive } = this.props
		const { isActive, isHover } = this.state
		const RenderIcon = interactive ? isActive ? this.ActiveIcon : isHover ? this.HoverIcon : this.NormalIcon : this.NormalIcon
		return RenderIcon ? <RenderIcon name={this.props.name} /> : null
	}

	private onClick = () => {
		this.props.onClick && this.props.onClick()
	}

	public render() {
		const { pointer, disabled, className, width, height } = this.props
		return (
			<div
				className={className}
				style={{
					display: 'flex',
					flexShrink: 0,
					alignItems: 'center',
					justifyContent: 'center',
					cursor: pointer ? 'pointer' : undefined,
					pointerEvents: disabled ? 'none' : undefined,
					opacity: disabled ? 0.4 : 1,
					width: typeof width === 'string' ? width : `${width}px`,
					height: typeof height === 'string' ? height : `${height}px`,
					position: 'relative'
				}}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
			>
				{/* 该div占位用， 防止interactive为true时 由于renderIcon渲染不同的icon导致click事件无法触发 */}
				<div style={{ position: 'absolute', width: '100%', height: '100%' }} />
				{
					this.renderIcon()
				}
			</div>
		);
	}
}

export default Icon
