import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'components';

interface Props {
	open: boolean;
	handleClose: () => void;
	handleDelete: () => void;
}

export const DeleteConversationModal: React.FC<Props> = ({ open, handleClose, handleDelete }) => {
	return (
		<Modal open={open} handleClose={handleClose}>
			<div className="text-center w-56">
				<div className="mx-auto my-4 w48 text-white">
					<FontAwesomeIcon icon={faTrash} />
					<h3 className="text-lg">Confirm Delete</h3>
					<p className="text-sm pb-6 pt-6">Are you sure you want to delete this conversation?</p>
					<div className="flex gap-4">
						<button className="btn btn-danger w-full" onClick={handleDelete}>
							Delete
						</button>
						<button className="btn btn-light w-full" onClick={handleClose}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
