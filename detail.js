const dataString = sessionStorage.getItem('selectedTodo');
const detailContainer = document.getElementById('detail-container');
if (dataString) {
    const data = JSON.parse(dataString);
    console.log(data)
    const todo = new Todo(data.title, data.isCompleted, new Date(data.creationDate));
    console.log(todo);
    detailContainer.innerHTML = `<h2>${todo.title}</h2>
                                 <span>${todo.isCompleted ? '' : 'non'} sono completato</span>
                                 <span>${todo.creationDate.toISOString()}</span>`

} else {
    detailContainer.innerHTML = '<strong>scemo chi legge</strong>'
}