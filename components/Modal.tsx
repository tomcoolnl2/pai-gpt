import React from 'react';
import ReactDOM from 'react-dom';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
	open: boolean;
	dismissable?: boolean;
	handleClose: () => void;
	children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ open, dismissable = true, handleClose, children }) => {
	//
	const [documentMounted, setDocumentMounted] = React.useState<boolean>(false);

	React.useEffect(() => {
		setDocumentMounted(true);
	}, []);

	return (
		documentMounted &&
		ReactDOM.createPortal(
			<div onClick={handleClose} className={`modal-backdrop ${open ? 'open' : 'invisible'}`}>
				<div onClick={(e) => e.stopPropagation()} className={`modal${open ? ' open' : ''}`}>
					{dismissable && (
						<button onClick={handleClose} className="modal-close">
							<FontAwesomeIcon icon={faClose} />
						</button>
					)}
					{children}
				</div>
			</div>,
			document.getElementById('modal-root'),
		)
	);
};
