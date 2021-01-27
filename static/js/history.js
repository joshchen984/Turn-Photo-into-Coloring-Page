class History {
    constructor() {
        this.undo_list = [];
        this.redo_list = [];
    }

    saveState(canvas, push_list, keep_redo) {
        keep_redo = false || keep_redo;
        if(!keep_redo){
            this.redo_list = [];
        }
        push_list = (push_list || this.undo_list);
        push_list.push(canvas.toDataURL());
        if(push_list.length > 15) {
            push_list.shift();
        }
    }

    undo(canvas, ctx) {
        this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
    }

    redo(canvas, ctx) {
        this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
    }

    restoreState(canvas, ctx, pop_list, push_list) {
        if (pop_list.length) {
            this.saveState(canvas, push_list, true);
            let restore_state = pop_list.pop();
            let img = new Image()
            img.src = restore_state;
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
        }
    }
}
