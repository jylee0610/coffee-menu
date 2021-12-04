const $ = (selector) => document.querySelector(selector);

function App() {
  const updateMenuCount = () => {
    const menuCount = $("#coffee-menu-list").querySelectorAll("li").length
    $(".menu-count").innerText = `총${menuCount}개`;
  };

  const addMenuName = () => {
    if ($("#coffee-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    const coffeeName = $("#coffee-name").value;
    const menuItemTemplate = (coffeeName) => {


      return `
                  <li class="menu-list-item d-flex items-center py-2">
              <span class="w-100 pl-2 menu-name">${coffeeName}</span>
              <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
              >
                수정
              </button>
              <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
              >
                삭제
              </button>
            </li>`;
    };

    $("#coffee-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(coffeeName)
    );

    updateMenuCount();
    $("#coffee-name").value = ""

  }

  const updateMenuName = (e) => {
    const $menuName = e.target
      .closest("li")
      .querySelector(".menu-name")
    const updatedMenuName = prompt(
      $menuName.innerText + "를 수정 하시겠습니까?",
      $menuName.innerText
    );
    $menuName.innerText = updatedMenuName;
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();

    }


  }
  $("#coffee-menu-list").addEventListener("click", (e) => {

    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }

  });

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });



  $("#submit-button").addEventListener("click",   addMenuName);

  $("#coffee-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();


  });

};

App();