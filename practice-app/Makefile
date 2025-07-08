# Переменные
PROJECT_NAME = pascal-limacon
BUILD_DIR = dist
SRC_DIR = src
NODE_MODULES = node_modules
PACKAGE_JSON = package.json

# Цвета для вывода
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Главная цель
.PHONY: all
all: install build

# Установка зависимостей
.PHONY: install
install:
	@echo "$(BLUE)📦 Установка зависимостей...$(NC)"
	npm install
	@echo "$(GREEN)✅ Зависимости установлены$(NC)"

# Запуск в режиме разработки
.PHONY: dev
dev:
	@echo "$(BLUE)🚀 Запуск в режиме разработки...$(NC)"
	npm run dev

# Сборка проекта
.PHONY: build
build:
	@echo "$(BLUE)🔨 Сборка проекта...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Проект собран в $(BUILD_DIR)$(NC)"

# Предварительный просмотр сборки
.PHONY: preview
preview: build
	@echo "$(BLUE)👀 Предварительный просмотр...$(NC)"
	npm run preview

# Проверка кода
.PHONY: lint
lint:
	@echo "$(BLUE)🔍 Проверка кода с ESLint...$(NC)"
	npm run lint

# Исправление ошибок линтера
.PHONY: lint-fix
lint-fix:
	@echo "$(BLUE)🔧 Исправление ошибок линтера...$(NC)"
	npm run lint -- --fix

# Очистка
.PHONY: clean
clean:
	@echo "$(YELLOW)🧹 Очистка build директории...$(NC)"
	rm -rf $(BUILD_DIR)
	@echo "$(GREEN)✅ Очистка завершена$(NC)"

# Полная очистка (включая node_modules)
.PHONY: clean-all
clean-all: clean
	@echo "$(YELLOW)🧹 Полная очистка (включая node_modules)...$(NC)"
	rm -rf $(NODE_MODULES)
	rm -rf package-lock.json
	@echo "$(GREEN)✅ Полная очистка завершена$(NC)"

# Создание архива для сдачи
.PHONY: archive
archive: clean build
	@echo "$(BLUE)📦 Создание архива для сдачи...$(NC)"
	mkdir -p submit/
	cp -r $(BUILD_DIR)/* submit/
	cp -r $(SRC_DIR) submit/
	cp $(PACKAGE_JSON) submit/
	cp README.md submit/
	cp -r docs/ submit/ 2>/dev/null || true
	tar -czf $(PROJECT_NAME)-submit.tar.gz submit/
	rm -rf submit/
	@echo "$(GREEN)✅ Архив создан: $(PROJECT_NAME)-submit.tar.gz$(NC)"

# Запуск тестов (если добавите)
.PHONY: test
test:
	@echo "$(BLUE)🧪 Запуск тестов...$(NC)"
	npm test 2>/dev/null || echo "$(YELLOW)⚠️  Тесты не настроены$(NC)"

# Анализ размера бандла
.PHONY: analyze
analyze: build
	@echo "$(BLUE)📊 Анализ размера бандла...$(NC)"
	npx vite-bundle-analyzer $(BUILD_DIR)

# Проверка зависимостей на уязвимости
.PHONY: audit
audit:
	@echo "$(BLUE)🔒 Проверка на уязвимости...$(NC)"
	npm audit

# Обновление зависимостей
.PHONY: update
update:
	@echo "$(BLUE)🔄 Обновление зависимостей...$(NC)"
	npm update

# Помощь
.PHONY: help
help:
	@echo "$(BLUE)📚 Доступные команды:$(NC)"
	@echo "  $(GREEN)make install$(NC)     - Установка зависимостей"
	@echo "  $(GREEN)make dev$(NC)         - Запуск в режиме разработки"
	@echo "  $(GREEN)make build$(NC)       - Сборка проекта"
	@echo "  $(GREEN)make preview$(NC)     - Предварительный просмотр сборки"
	@echo "  $(GREEN)make lint$(NC)        - Проверка кода"
	@echo "  $(GREEN)make lint-fix$(NC)    - Исправление ошибок линтера"
	@echo "  $(GREEN)make clean$(NC)       - Очистка build директории"
	@echo "  $(GREEN)make clean-all$(NC)   - Полная очистка"
	@echo "  $(GREEN)make archive$(NC)     - Создание архива для сдачи"
	@echo "  $(GREEN)make test$(NC)        - Запуск тестов"
	@echo "  $(GREEN)make analyze$(NC)     - Анализ размера бандла"
	@echo "  $(GREEN)make audit$(NC)       - Проверка на уязвимости"
	@echo "  $(GREEN)make update$(NC)      - Обновление зависимостей"
