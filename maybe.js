// CUSTOM IMPLEMENTATION OF MAYBE/OPTION/EITHER MONAD.
class Maybe {
  value
  nothings = [undefined, null]

  constructor(value, nothings = []) {
      if (!Array.isArray(nothings)) { nothings = [nothings] }
      nothings.push(undefined, null)

      this.nothings   = nothings
      this.value      = value
      this.isSome     = false
      this.isNone     = false
  }

  ifSomething(fn)     { return this }

  ifNothing(fn)       { return this }

  ifSomethingSet(fn)  { return this }

  ifNothingSet(fn)    { return this }

  alwaysDo(fn) {
      fn(this.value)
      return this
  }

  get value() {
      if (this.constructor.name !== 'Option') {
          return this.value
      }

      throw new Error('Cannot directly access value from Option monad.')
  }

  set value(value) {
      if (this.constructor.name !== 'Option') {
          return this.value = value
      }

      throw new Error('Cannot directly access value from Option monad.')
  }
}

class Some extends Maybe {
  constructor(value, nothings = []) {
      super(value, nothings)
      this.isSome = true
  }

  ifSomething(fn) {
      fn(super.value)
      return this
  }

  ifSomethingSet(fn) {
      super.value = fn(super.value)

      if (super.nothings.includes(super.value)) {
          return new None(super.value, super.nothings)
      }
      else { return this }
  }

  ifSome() { return true }

  alwaysDoAndSet(fn) {
      super.value = fn(super.value)

      if (super.nothings.includes(super.value)) {
          return new None(super.value, super.nothings)
      }
      else { return this }
  }
}

class None extends Maybe {
  constructor(value, nothings = []) {
      super(value, nothings)
      this.isNone = true
  }

  ifNothing(fn) {
      fn(super.value)
      return this
  }

  ifNothingSet(fn) {
      super.value = fn(super.value)

      if (!super.nothings.includes(super.value)) {
          return new Some(super.value, super.nothings)
      }
      else { return this }
  }

  alwaysDoAndSet(fn) {
      super.value = fn(super.value)

      if (!super.nothings.includes(super.value)) {
          return new Some(super.value, super.nothings)
      }
      else { return this }
  }
}

function some(value) {
  return new Some(value)
}

function none(value) {
  return new None(value)
}

function maybe(value, nothing=[]) {
  if (!Array.isArray(nothing)) { nothing = [nothing] }
  nothing.push(undefined, null)

  if (nothing.includes(value)) {
      return none(value, nothing)
  }
  else { return some(value, nothing) }
}