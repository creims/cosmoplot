import React, {ReactNode} from 'react';
import './Modal.css';

type Props = {
    title: string,
    show: boolean,
    children: ReactNode,
    handleClose: () => void
}

const Modal: React.FC<Props> = (props: Props) => {
    const showHideClassName = props.show ? 'Modal-show' : 'Modal-hide';
    return (
        <div className={'Modal ' + showHideClassName}>
            <div className='ui-box Modal-box'>
                <h1 className='Modal-header'>{props.title}</h1>
                {props.children}
                <button
                    className='Modal-close-button'
                    onClick={props.handleClose}
                >Close</button>
            </div>
        </div>
    );
};

export default Modal;