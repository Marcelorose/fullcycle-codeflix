import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../category.entity"

describe('Category Unit Tests', () => {
  let validateSpy: jest.SpyInstance
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate')
  })

  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test('should create a category with all values', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at,
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBe(created_at)
    })

    test('should create a category with name and description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })
  })

  describe('category_id test', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ]

    test.each(arrange)('should create a category with category_id %p', ({category_id}) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      })

      expect(category.category_id).toBeInstanceOf(Uuid)

      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id)
      }
    })
  })

  describe('create command', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with name and description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('change values', () => {
    test('should change name', () => {
      const category = Category.create({
        name: 'Movie',
      })

      category.changeName('Book')

      expect(category.name).toBe('Book')
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })

    test('should change description', () => {
      const category = Category.create({
        name: 'Movie',
      })

      category.changeDescription('Book description')

      expect(category.description).toBe('Book description')
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })

    test('should activate category', () => {
      const category = new Category({
        name: 'Movie',
        is_active: false,
      })

      category.activate()

      expect(category.is_active).toBeTruthy()
    })

    test('should deactivate category', () => {
      const category = new Category({
        name: 'Movie',
        is_active: true,
      })

      category.deactivate()

      expect(category.is_active).toBeFalsy()
    })
  })

  describe('Category Validator', () => {

    describe('create command', () => {
      test('should throw error on invalid category name property', () => {
        expect(() => Category.create({ name: null})).containsErrorMessages({
          name: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })

        expect(() => Category.create({ name: ''})).containsErrorMessages({
          name: [
            'name should not be empty',
          ]
        })

        expect(() => Category.create({ name: 'a'.repeat(256)})).containsErrorMessages({
          name: [
            'name must be shorter than or equal to 255 characters'
          ]
        })

        expect(() => Category.create({ name: 123 as any})).containsErrorMessages({
          name: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })
      })

      test('should throw error on invalid category description property', () => {
        expect(() => Category.create({ name: 'Movie', description: 123 as any})).containsErrorMessages({
          description: [
            'description must be a string',
          ]
        })
      })

      test('should throw error on invalid category is_active property', () => {
        expect(() => Category.create({ name: 'Movie', is_active: 123 as any}
        )).containsErrorMessages({
          is_active: [
            'is_active must be a boolean value',
          ]
        })
      })
    })

    describe('change name', () => {
      test('should throw error on invalid category name property', () => {
        const category = Category.create({ name: 'Movie' })

        expect(() => category.changeName(null)).containsErrorMessages({
          name: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })

        expect(() => category.changeName('')).containsErrorMessages({
          name: [
            'name should not be empty',
          ]
        })

        expect(() => category.changeName('a'.repeat(256))).containsErrorMessages({
          name: [
            'name must be shorter than or equal to 255 characters'
          ]
        })

        expect(() => category.changeName(123 as any)).containsErrorMessages({
          name: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })
      })
    })

    describe('change description', () => {
      test('should throw error on invalid category description property', () => {
        const category = Category.create({ name: 'Movie' })

        expect(() => category.changeDescription(123 as any)).containsErrorMessages({
          description: [
            'description must be a string',
          ]
        })
      })
    })
  })
})
