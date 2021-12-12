import {
  $
} from "./dom.js";
import store from "../store/index.js";
import MenuApi from "./api/index.js";





function App() {
  this.menu = {
    coffee: [],
    ade: [],
    tea: [],
    dessert: [],
    etc: [],


  };
  this.currentCategory = "coffee";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();

  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {

        return `
                  <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
              <span class= "w-100 pl-2 menu-name ${menuItem.isSoldOut ? 'sold-out':""}
              "> ${menuItem.name}</span>
             
              <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1  menu-sold-out-button"
              >
                품절
              </button>
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
             
              
            </li>`
      })
      .join("");


    $("#coffee-menu-list").innerHTML = template;
    updateMenuCount();


  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총${menuCount}개`;
  };

  const addMenuName = async () => {
    if ($("#coffee-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    };


    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem)=>menuItem.name === $("#coffee-name").value
    );
    
    if(duplicatedItem){
      alert("이미 등록된 메뉴입니다. 다시 입력 해주세요")
      $("#coffee-name").value = ""
      return;
    }

    const menuName = $("#coffee-name").value;

    await MenuApi.createMenu(this.currentCategory, menuName);
    render();


    $("#coffee-name").value = ""

  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt($menuName.innerText +
      "를 수정 하시겠습니까?", $menuName.innerText);

    await MenuApi.updateMenu(this.currentCategory, updateMenuName, menuId);


    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      );

      render();


    }

  };
  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };
  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("header-btn");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
      render();
    }
  };



  const initEventListeners = () => {
    $("#coffee-menu-list").addEventListener("click", (e) => {

      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#submit-button").addEventListener("click", addMenuName);

    $("#coffee-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName()

    });

    $("nav").addEventListener("click", changeCategory);



  };
}

const app = new App();
app.init();