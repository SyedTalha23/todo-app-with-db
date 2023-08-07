// document.addEventListener('DOMContentLoaded', function () {
//     const taskList = document.getElementById('taskList');
  
//     taskList.addEventListener('click', function (event) {
//       const target = event.target;
//       if (target.tagName.toLowerCase() === 'button') {
//         const index = target.dataset.index;
//         removeTask(index);
//       }
//     });
  
//     function removeTask(index) {
//       // Send an AJAX request to remove the task from the server-side
//       // Or handle the removal directly on the client-side
//       // For this example, we'll just remove it from the list on the client-side
//       taskList.removeChild(taskList.childNodes[index]);
//     }
//   });
  