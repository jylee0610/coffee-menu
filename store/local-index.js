const { nanoid } = require("nanoid");



const validator = {
  isNumber(value) {
    return value && !isNaN(value);
  },
  isEmptyStr(value) {
    return value === "" || value === undefined || value === null;
  },
  isArray(value) {
    return Array.isArray(value);
  },
};

function Store() {
  this.id = nanoid();
  this.menu = {
    coffee: [],
    ade: [],
    tea: [],
    dessert: [],
    etc: [],
  };
  this.isValid = ({ res, category = null, menuId = null, name = null }) => {
    if (
      !validator.isArray(this.menu[category]) &&
      !!this.menu[category]
    ) {
      res.status(404).json({ message: "존재하지 않는 카테고리 입니다." });
      return;
    }
    if (menuId && !this.isExistMenuItem(category, menuId)) {
      res.status(404).json({ message: "존재하지 않는 메뉴 입니다." });
      return;
    }
    if (name && !this.isValidMenuName(name)) {
      res
        .status(400)
        .json({ message: "메뉴 이름은 최소 2글자 이상이어야 합니다." });
      return;
    }

    return true;
  };
  this.isValidMenuName = (name) => {
    return typeof name === "string" && name.length > 1;
  };

  this.createMenuItem = (category, menuItem) => {
    this.menu[category].push(menuItem);
  };
  this.toggleSoldOutMenuItem = (category, menuId) => {
    const index = this.menu[category].findIndex(
      (item) => item.id === menuId
    );
    if (this.menu[category][index]) {
      this.menu[category][index].isSoldOut =
        !this.menu[category][index].isSoldOut;
    }
  };
  this.updateMenuItem = (category, menuId, name) => {
    this.menu[category].find((item) => item.id === menuId).name = name;
  };
  this.getMenuListByCategory = (category) => {
    return this.menu[category];
  };
  this.getByMenuId = (category, menuId) => {
    return this.menu[category].find((item) => item.id === menuId);
  };
  this.isDuplicatedMenu = (category, name) => {
    return !!this.menu[category].find((item) => item.name === name);
  };
  this.isExistMenuItem = (category, menuId) => {
    return !!this.menu[category].find(
      (menuItem) => menuItem.id === menuId
    );
  };
  this.deleteMenuItem = (category, menuId) => {
    const menuItemIndex = this.menu[category].findIndex(
      (menu) => menu.id === menuId
    );
    this.menu[category].splice(menuItemIndex, 1);
    console.log(this.menu[category]);
  };
}

module.exports = Store;
