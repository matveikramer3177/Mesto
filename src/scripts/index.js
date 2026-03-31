const initialCards = [
  { name: "Архыз", link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg" },
  { name: "Челябинская область", link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg" },
  { name: "Иваново", link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg" },
  { name: "Камчатка", link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg" },
  { name: "Холмогорский район", link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg" },
  { name: "Байкал", link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg" }
];

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const cardContainer = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const avatarImage = document.querySelector('.profile__image');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_edit-avatar');
const popupImage = document.querySelector('.popup_type_image');

const formEdit = document.forms['edit-profile'];
const formNewCard = document.forms['new-place'];
const formAvatar = document.forms['edit-avatar'];

const nameInput = formEdit.elements['user-name'];
const jobInput = formEdit.elements['user-description'];
const profileTitle = document.querySelector('.profile__title');
const profileDesc = document.querySelector('.profile__description');

function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEsc);
}

function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closeModal(openedPopup);
  }
}

document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_is-opened') || evt.target.classList.contains('popup__close')) {
      closeModal(popup);
    }
  });
});

function createCard(data, deleteFn, likeFn, openImgFn) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImg = cardElement.querySelector('.card__image');
  
  cardImg.src = data.link;
  cardImg.alt = data.name;
  cardElement.querySelector('.card__title').textContent = data.name;

  cardElement.querySelector('.card__control-button_type_delete').addEventListener('click', deleteFn);
  cardElement.querySelector('.card__like-button').addEventListener('click', likeFn);
  cardImg.addEventListener('click', () => openImgFn(data));

  return cardElement;
}

const deleteCard = (evt) => evt.target.closest('.card').remove();
const likeCard = (evt) => evt.target.classList.toggle('card__like-button_is-active');

const openImagePopup = (data) => {
  const img = popupImage.querySelector('.popup__image');
  const cap = popupImage.querySelector('.popup__caption');
  img.src = data.link;
  img.alt = data.name;
  cap.textContent = data.name;
  openModal(popupImage);
};

// --- ВАЛИДАЦИЯ ---
const showInputError = (form, input, msg, cfg) => {
  const error = form.querySelector(`#${input.id}-error`);
  input.classList.add(cfg.inputErrorClass);
  error.textContent = msg;
  error.classList.add(cfg.errorClass);
};

const hideInputError = (form, input, cfg) => {
  const error = form.querySelector(`#${input.id}-error`);
  input.classList.remove(cfg.inputErrorClass);
  error.classList.remove(cfg.errorClass);
  error.textContent = '';
};

const checkInputValidity = (form, input, cfg) => {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  } else {
    input.setCustomValidity("");
  }
  if (!input.validity.valid) {
    showInputError(form, input, input.validationMessage, cfg);
  } else {
    hideInputError(form, input, cfg);
  }
};

const toggleButtonState = (inputs, btn, cfg) => {
  const isInvalid = inputs.some(i => !i.validity.valid);
  btn.disabled = isInvalid;
  btn.classList.toggle(cfg.inactiveButtonClass, isInvalid);
};

const clearValidation = (form, cfg) => {
  const inputs = Array.from(form.querySelectorAll(cfg.inputSelector));
  const btn = form.querySelector(cfg.submitButtonSelector);
  inputs.forEach(i => hideInputError(form, i, cfg));
  toggleButtonState(inputs, btn, cfg);
};

const enableValidation = (cfg) => {
  const forms = Array.from(document.querySelectorAll(cfg.formSelector));
  forms.forEach(form => {
    const inputs = Array.from(form.querySelectorAll(cfg.inputSelector));
    const btn = form.querySelector(cfg.submitButtonSelector);
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        checkInputValidity(form, input, cfg);
        toggleButtonState(inputs, btn, cfg);
      });
    });
  });
};

// --- ОБРАБОТЧИКИ ФОРМ ---
formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDesc.textContent = jobInput.value;
  closeModal(popupEdit);
});

formNewCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = { name: formNewCard.elements['place-name'].value, link: formNewCard.elements['place-link'].value };
  cardContainer.prepend(createCard(newCard, deleteCard, likeCard, openImagePopup));
  closeModal(popupNewCard);
  formNewCard.reset();
});

initialCards.forEach(item => cardContainer.append(createCard(item, deleteCard, likeCard, openImagePopup)));

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDesc.textContent;
  clearValidation(formEdit, validationConfig);
  openModal(popupEdit);
});

profileAddButton.addEventListener('click', () => {
  formNewCard.reset();
  clearValidation(formNewCard, validationConfig);
  openModal(popupNewCard);
});

avatarImage.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openModal(popupAvatar);
});

enableValidation(validationConfig);
