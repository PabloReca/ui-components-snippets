document.addEventListener('DOMContentLoaded', function () {
    var selects = document.querySelectorAll('select');
    selects.forEach(function (select) {
        createCustomSelect(select);
    });
});

function createCustomSelect(select) {
    var container = createContainer();
    var searchBox = createSearchBox(select);
    container.appendChild(searchBox);

    var optionsContainer = createOptionsContainer();
    container.appendChild(optionsContainer);

    populateOptionsContainer(optionsContainer, select.querySelectorAll('option'));
    setUpSearchBoxEventListeners(searchBox, optionsContainer, select);

    select.parentNode.insertBefore(container, select);
    select.className = 'custom-select';
}

function createContainer() {
    var container = document.createElement('div');
    container.className = 'custom-select-container';
    return container;
}

function createSearchBox(select) {
    var searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'search-box';

    var placeholder = select.getAttribute('data-placeholder');
    if (placeholder) {
        searchBox.placeholder = placeholder;
    }

    return searchBox;
}

function createOptionsContainer() {
    var optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    return optionsContainer;
}

function populateOptionsContainer(optionsContainer, options) {
    options.forEach(function (option) {
        var optionDiv = document.createElement('div');
        optionDiv.textContent = option.textContent;

        optionDiv.addEventListener('mouseover', function () {
            Array.from(optionsContainer.children).forEach(function (child) {
                child.classList.remove('focused');
            });
            optionDiv.classList.add('focused');
        });

        optionsContainer.appendChild(optionDiv);
    });
}

function setUpSearchBoxEventListeners(searchBox, optionsContainer, select) {
    searchBox.focusedOptionIndex = -1;

    searchBox.addEventListener('input', function () {
        this.focusedOptionIndex = -1;
        filterOptions(this, optionsContainer);
    });

    searchBox.addEventListener('focus', function () {
        expandOptionsContainer(optionsContainer);
    });

    searchBox.addEventListener('blur', function () {
        collapseOptionsContainer(this, optionsContainer);
    });

    searchBox.addEventListener('keydown', function (e) {
        handleKeyDown(e, this, optionsContainer, select);
    });

    optionsContainer.addEventListener('click', function (e) {
        handleOptionClick(e, searchBox, optionsContainer, select);
    });
}

function filterOptions(searchBox, optionsContainer) {
    var searchValue = searchBox.value.toLowerCase();
    var optionDivs = optionsContainer.children;

    for (var i = 0; i < optionDivs.length; i++) {
        var optionValue = optionDivs[i].textContent.toLowerCase();
        optionDivs[i].style.display = optionValue.includes(searchValue) ? 'block' : 'none';
    }
}

function expandOptionsContainer(optionsContainer) {
    Array.from(optionsContainer.children).forEach(function (optionDiv) {
        optionDiv.style.display = 'block';
    });
    optionsContainer.style.maxHeight = '150px';
    optionsContainer.style.borderWidth = '1px';
}

function collapseOptionsContainer(searchBox, optionsContainer) {
    setTimeout(function () {
        optionsContainer.style.maxHeight = '0';
        optionsContainer.style.borderWidth = '0';
        if (searchBox.focusedOptionIndex === -1) {
            searchBox.value = '';
        }
    }, 200);
}

function handleKeyDown(e, searchBox, optionsContainer, select) {
    var visibleOptions = Array.from(optionsContainer.children).filter(function(optionDiv) {
        return optionDiv.style.display !== 'none';
    });

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        searchBox.focusedOptionIndex++;
        if (searchBox.focusedOptionIndex >= visibleOptions.length) searchBox.focusedOptionIndex = 0;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchBox.focusedOptionIndex--;
        if (searchBox.focusedOptionIndex < 0) searchBox.focusedOptionIndex = visibleOptions.length - 1;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchBox.focusedOptionIndex >= 0 && searchBox.focusedOptionIndex < visibleOptions.length) {
            searchBox.value = visibleOptions[searchBox.focusedOptionIndex].textContent;
            select.value = visibleOptions[searchBox.focusedOptionIndex].textContent;
            optionsContainer.style.maxHeight = '0';
            optionsContainer.style.borderWidth = '0'; // Colapsar inmediatamente después de la selección
        }
        return;
    } else {
        searchBox.focusedOptionIndex = -1;
    }

    visibleOptions.forEach(function(optionDiv, index) {
        optionDiv.classList.toggle('focused', index === searchBox.focusedOptionIndex);
    });
}



function handleOptionClick(e, searchBox, optionsContainer, select) {
    var clickedOption = e.target;
    searchBox.value = clickedOption.textContent;
    select.value = clickedOption.textContent;
    optionsContainer.style.maxHeight = '0';

    var allOptionDivs = Array.from(optionsContainer.children);
    searchBox.focusedOptionIndex = allOptionDivs.findIndex(function (optionDiv) {
        return optionDiv === clickedOption;
    });
}
