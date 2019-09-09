export default class ImageDropAndPaste {

	constructor(quill, options = {}) {
		this.quill = quill
		this.options = options
		this.handleDrop = this.handleDrop.bind(this)
		this.handlePaste = this.handlePaste.bind(this)
		this.quill.root.addEventListener('drop', this.handleDrop, false)
		this.quill.root.addEventListener('paste', this.handlePaste, false)
	}

	/* handle image drop event
	*/
	handleDrop (e) {
		e.preventDefault()
		if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
			if (document.caretRangeFromPoint) {
				const selection = document.getSelection()
				const range = document.caretRangeFromPoint(e.clientX, e.clientY)
				if (selection && range) {
					selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset)
				}
			}
			this.readFiles(e.dataTransfer.files, (dataUrl, type) => {
				if (typeof this.options.handler === 'function') {
					this.options.handler(dataUrl, type)
				} else {
					this.insert.call(this, dataUrl, type)
				}
			}, e)
		}
	}

	/* handle image paste event
	*/
	handlePaste (e) {
		if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
			this.readFiles(e.clipboardData.items, (dataUrl, type) => {
				if (typeof this.options.handler === 'function') {
					this.options.handler(dataUrl, type)
				} else {
					this.insert(dataUrl, type)
				}
			}, e)
		}
	}

	/* read the files
	*/
	readFiles (files, callback, e) {
		[].forEach.call(files, file => {
			var type = file.type
			if (!type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) return
			e.preventDefault()
			const reader = new FileReader()
			reader.onload = (e) => {
				callback(e.target.result, type)
			}
			const blob = file.getAsFile ? file.getAsFile() : file
			if (blob instanceof Blob) reader.readAsDataURL(blob)
		})
	}

	/* insert into the editor
	*/
	insert (dataUrl, type) {
		const index = (this.quill.getSelection() || {}).index || this.quill.getLength()
		this.quill.insertEmbed(index, 'image', dataUrl, 'user')
	}

}