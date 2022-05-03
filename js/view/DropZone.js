import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {

	static createDropZone() 
	{
		const range = document.createRange();

		range.selectNode(document.body);

		const dropZone = range.createContextualFragment(`
			<div class="kanbanDropZone"></div>
		`).children[0];

		dropZone.addEventListener("dragover", e => {
			e.preventDefault();
			dropZone.classList.add("kanbanDropZone--active");
		});

		dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("kanbanDropZone--active");
		});

		dropZone.addEventListener("drop", e => {
			e.preventDefault();
			
			dropZone.classList.remove("kanbanDropZone--active");

			const columnElement = dropZone.closest(".kanbanColumn");
			const columnId = Number(columnElement.dataset.id);
			const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanbanDropZone"));
			const droppedIndex = dropZonesInColumn.indexOf(dropZone);
			const itemId = Number(e.dataTransfer.getData("text/plain"));
			const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
			const insertAfter = dropZone.parentElement.classList.contains("kanbanItem") ? dropZone.parentElement : dropZone;

			if (droppedItemElement.contains(dropZone)) 
			{
				return;
			}

			insertAfter.after(droppedItemElement);
			KanbanAPI.updateItem(itemId, {
				columnId,
				position: droppedIndex

			});

		});

		return dropZone;
	}
}