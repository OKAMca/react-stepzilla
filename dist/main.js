'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StepZilla = function (_Component) {
  _inherits(StepZilla, _Component);

  function StepZilla(props) {
    _classCallCheck(this, StepZilla);

    var _this = _possibleConstructorReturn(this, (StepZilla.__proto__ || Object.getPrototypeOf(StepZilla)).call(this, props));

    _this.state = _extends({}, _this.getPrevNextBtnState(_this.props.startAtStep), {
      compState: _this.props.startAtStep,
      navState: _this.getNavStates(_this.props.startAtStep, _this.props.steps.length)
    });

    _this.hiddenCls = 'hidden';

    // if user did not give a custom nextTextOnFinalActionStep, the nextButtonText becomes the default
    _this.nextTextOnFinalActionStep = _this.props.nextTextOnFinalActionStep ? _this.props.nextTextOnFinalActionStep : _this.props.nextButtonText;

    _this.applyValidationFlagsToSteps();
    return _this;
  }

  // extend the "steps" array with flags to indicate if they have been validated


  _createClass(StepZilla, [{
    key: 'applyValidationFlagsToSteps',
    value: function applyValidationFlagsToSteps() {
      var _this2 = this;

      this.props.steps.map(function (i, idx) {
        if (_this2.props.dontValidate) {
          i.validated = true;
        } else {
          // check if isValidated was exposed in the step, if yes then set initial state as not validated (false) or vice versa
          // if HOCValidation is used for the step then mark it as "requires to be validated. i.e. false"
          i.validated = typeof i.component.type === 'undefined' || typeof i.component.type.prototype.isValidated === 'undefined' && !_this2.isStepAtIndexHOCValidationBased(idx) ? true : false;
        }

        return i;
      });
    }

    // update the header nav states via classes so they can be styled via css

  }, {
    key: 'getNavStates',
    value: function getNavStates(indx, length) {
      var styles = [];

      for (var i = 0; i < length; i++) {
        if (i < indx) {
          styles.push('done');
        } else if (i === indx) {
          styles.push('doing');
        } else {
          styles.push('todo');
        }
      }

      return { current: indx, styles: styles };
    }
  }, {
    key: 'getPrevNextBtnState',
    value: function getPrevNextBtnState(currentStep) {
      // first set default values
      var showPreviousBtn = true;
      var showNextBtn = true;
      var nextStepText = this.props.nextButtonText;

      // first step hide previous btn
      if (currentStep === 0) {
        showPreviousBtn = false;
      }

      // second to last step change next btn text if supplied as props
      if (currentStep === this.props.steps.length - 2) {
        nextStepText = this.props.nextTextOnFinalActionStep || nextStepText;
      }

      // last step hide next btn, hide previous btn if supplied as props
      if (currentStep >= this.props.steps.length - 1) {
        showNextBtn = false;
        showPreviousBtn = this.props.prevBtnOnLastStep === false ? false : true;
      }

      return {
        showPreviousBtn: showPreviousBtn,
        showNextBtn: showNextBtn,
        nextStepText: nextStepText
      };
    }

    // which step are we in?

  }, {
    key: 'checkNavState',
    value: function checkNavState(nextStep) {
      var _this3 = this;

      if (this.props.onStepChange) {
        return _promise2.default.resolve(this.props.onStepChange(nextStep)).then(function () {
          _this3.setState(_this3.getPrevNextBtnState(nextStep));
        });
      }

      this.setState(this.getPrevNextBtnState(nextStep));
    }

    // set the nav state

  }, {
    key: 'setNavState',
    value: function setNavState(next) {
      this.setState({ navState: this.getNavStates(next, this.props.steps.length) });

      if (next < this.props.steps.length) {
        this.setState({ compState: next });
      }

      this.checkNavState(next);
    }

    // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next (ignore textareas as they should allow line breaks)

  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(evt) {
      if (evt.which === 13) {
        if (!this.props.preventEnterSubmission && evt.target.type !== 'textarea' && evt.target.type !== 'search') {
          this.next();
        } else if (evt.target.type !== 'textarea' && evt.target.type !== 'search') {
          evt.preventDefault();
        }
      }
    }

    // this utility method lets Child components invoke a direct jump to another step

  }, {
    key: 'jumpToStep',
    value: function jumpToStep(evt) {
      var _this4 = this;

      if (evt.currentTarget == undefined) {
        // a child step wants to invoke a jump between steps. in this case 'evt' is the numeric step number and not the JS event
        this.setNavState(evt);
      } else {
        // the main navigation step ui is invoking a jump between steps
        if (!this.props.stepsNavigation || evt.currentTarget.value === this.state.compState) {
          // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore
          evt.preventDefault();
          evt.stopPropagation();

          return;
        }

        evt.persist(); // evt is a react event so we need to persist it as we deal with aync promises which nullifies these events (https://facebook.github.io/react/docs/events.html#event-pooling)

        var movingBack = evt.currentTarget.value < this.state.compState; // are we trying to move back or front?
        if (!movingBack) return; // prevent moving forward using step counter

        var passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...
        var proceed = false; // flag on if we should move on

        this.abstractStepMoveAllowedToPromise(movingBack).then(function () {
          var valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined, so make it true. Or else 'proceed' will carry the true/false value from sync v
          proceed = valid;

          if (!movingBack) {
            _this4.updateStepValidationFlag(proceed);
          }

          if (proceed) {
            if (!movingBack) {
              // looks like we are moving forward, 'reduce' a new array of step>validated values we need to check and 'some' that to get a decision on if we should allow moving forward
              passThroughStepsNotValid = _this4.props.steps.reduce(function (a, c, i) {
                if (i >= _this4.state.compState && i < evt.currentTarget.value) {
                  a.push(c.validated);
                }
                return a;
              }, []).some(function (c) {
                return c === false;
              });
            }
          }
        }).catch(function (e) {
          // Promise based validation was a fail (i.e reject())
          if (!movingBack) {
            _this4.updateStepValidationFlag(false);
          }
        }).then(function () {
          // this is like finally(), executes if error no no error
          if (proceed && !passThroughStepsNotValid) {
            if (evt.currentTarget.value === _this4.props.steps.length - 1 && _this4.state.compState === _this4.props.steps.length - 1) {
              _this4.setNavState(_this4.props.steps.length);
            } else {
              _this4.setNavState(evt.currentTarget.value);
            }
          }
        }).catch(function (e) {
          if (e) {
            // see note below called "CatchRethrowing"
            // ... plus the finally then() above is what throws the JS Error so we need to catch that here specifically
            setTimeout(function () {
              throw e;
            });
          }
        });
      }
    }

    // move next via next button

  }, {
    key: 'next',
    value: function next() {
      var _this5 = this;

      this.abstractStepMoveAllowedToPromise().then(function () {
        var proceed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined, so make it true. Or else 'proceed' will carry the true/false value from sync validation
        _this5.updateStepValidationFlag(proceed);

        if (proceed) {
          _this5.setNavState(_this5.state.compState + 1);
        }
      }).catch(function (e) {
        if (e) {
          // CatchRethrowing: as we wrap StepMoveAllowed() to resolve as a Promise, the then() is invoked and the next React Component is loaded.
          // ... during the render, if there are JS errors thrown (e.g. ReferenceError) it gets swallowed by the Promise library and comes in here (catch)
          // ... so we need to rethrow it outside the execution stack so it behaves like a notmal JS error (i.e. halts and prints to console)
          //
          setTimeout(function () {
            throw e;
          });
        }

        // Promise based validation was a fail (i.e reject())
        _this5.updateStepValidationFlag(false);
      });
    }

    // move behind via previous button

  }, {
    key: 'previous',
    value: function previous() {
      if (this.state.compState > 0) {
        this.setNavState(this.state.compState - 1);
      }
    }

    // update step's validation flag

  }, {
    key: 'updateStepValidationFlag',
    value: function updateStepValidationFlag() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.props.steps[this.state.compState].validated = val; // note: if a step component returns 'underfined' then treat as "true".
    }

    // are we allowed to move forward? via the next button or via jumpToStep?

  }, {
    key: 'stepMoveAllowed',
    value: function stepMoveAllowed() {
      var skipValidationExecution = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var proceed = false;

      if (this.props.dontValidate) {
        proceed = true;
      } else {
        if (skipValidationExecution) {
          // we are moving backwards in steps, in this case dont validate as it means the user is not commiting to "save"
          proceed = true;
        } else if (this.isStepAtIndexHOCValidationBased(this.state.compState)) {
          // the user is using a higer order component (HOC) for validation (e.g react-validation-mixin), this wraps the StepZilla steps as a HOC,
          // so use hocValidationAppliedTo to determine if this step needs the aync validation as per react-validation-mixin interface
          proceed = this.activeComponent.isValidated();
        } else if (!this.activeComponent || typeof this.activeComponent.isValidated === 'undefined') {
          // if its a form component, it should have implemeted a public isValidated class (also pure componenets wont even have refs - i.e. a empty object). If not then continue
          proceed = true;
        } else {
          // user is moving forward in steps, invoke validation as its available
          proceed = this.activeComponent.isValidated();
        }
      }

      return proceed;
    }
  }, {
    key: 'isStepAtIndexHOCValidationBased',
    value: function isStepAtIndexHOCValidationBased(stepIndex) {
      return this.props.hocValidationAppliedTo.length > 0 && this.props.hocValidationAppliedTo.indexOf(stepIndex) > -1;
    }

    // a validation method is each step can be sync or async (Promise based), this utility abstracts the wrapper stepMoveAllowed to be Promise driven regardless of validation return type

  }, {
    key: 'abstractStepMoveAllowedToPromise',
    value: function abstractStepMoveAllowedToPromise(movingBack) {
      return _promise2.default.resolve(this.stepMoveAllowed(movingBack));
    }

    // get the classmame of steps

  }, {
    key: 'getClassName',
    value: function getClassName(className, i) {
      var liClassName = className + "-" + this.state.navState.styles[i];

      // if step ui based navigation is disabled, then dont highlight step
      if (!this.props.stepsNavigation) liClassName += " no-hl";

      return liClassName;
    }

    // render the steps as stepsNavigation

  }, {
    key: 'renderSteps',
    value: function renderSteps() {
      var _this6 = this;

      var isDisabled = function isDisabled(i) {
        return _this6.props.disabledSteps.includes(i);
      };

      return this.props.steps.map(function (s, i) {
        return _react2.default.createElement(
          'li',
          {
            className: _this6.getClassName("progtrckr", i) + (i === 0 ? " first" : "") + (i + 1 === _this6.props.steps.length ? " last" : ""),
            onClick: function onClick(evt) {
              if (isDisabled(i)) return;
              _this6.jumpToStep(evt);
            },
            key: i,
            value: i,
            style: { cursor: i < _this6.state.navState.current && !isDisabled(i) ? "pointer" : "default" }
          },
          _react2.default.createElement(
            'em',
            null,
            i + 1
          ),
          _react2.default.createElement(
            'span',
            { className: isDisabled(i) ? "text-muted" : "", style: { opacity: isDisabled(i) ? 0.5 : 1 } },
            _this6.props.steps[i].name
          ),
          _react2.default.createElement('span', { className: 'progtrckr-inner' })
        );
      });
    }

    // main render of stepzilla container

  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var props = this.props;

      var compToRender = void 0;

      // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
      var cloneExtensions = {
        jumpToStep: function jumpToStep(t) {
          _this7.jumpToStep(t);
        },
        next: function next(t) {
          _this7.next(t);
        },
        previous: function previous(t) {
          _this7.previous(t);
        }
      };

      var componentPointer = this.props.steps[this.state.compState].component;

      // can only update refs if its a regular React component (not a pure component), so lets check that
      if (componentPointer.type && componentPointer.type.prototype.render) {
        cloneExtensions.ref = function (el) {
          if (el) _this7.activeComponent = el;
        };
      }

      compToRender = _react2.default.cloneElement(componentPointer, cloneExtensions);

      return _react2.default.createElement(
        'div',
        { className: 'multi-step', onKeyDown: function onKeyDown(evt) {
            _this7.handleKeyDown(evt);
          } },
        this.props.progressTrackerSiblingBefore,
        this.props.showSteps ? _react2.default.createElement(
          'ol',
          { className: "progtrckr" + (this.props.progressTrackerCls ? " " + this.props.progressTrackerCls : "") },
          this.renderSteps()
        ) : _react2.default.createElement('span', null),
        this.props.progressTrackerSiblingAfter,
        compToRender,
        _react2.default.createElement(
          'div',
          { className: "footer-buttons" + (!this.props.showNavigation ? " " + this.hiddenCls : "") },
          _react2.default.createElement(
            'button',
            {
              className: props.backButtonCls + (!this.state.showPreviousBtn ? " " + this.hiddenCls : ""),
              onClick: function onClick() {
                if (_this7.props.disableBackButton) return;
                _this7.previous();
              },
              id: 'prev-button'
            },
            this.props.backButtonText
          ),
          _react2.default.createElement(
            'button',
            {
              className: props.nextButtonCls + (!this.state.showNextBtn ? " " + this.hiddenCls : ""),
              onClick: function onClick() {
                if (_this7.state.navState.current === 0 && !_this7.props.isReady) return;
                _this7.next();
              },
              id: 'next-button'
            },
            this.state.nextStepText
          )
        )
      );
    }
  }]);

  return StepZilla;
}(_react.Component);

exports.default = StepZilla;


StepZilla.defaultProps = {
  showSteps: true,
  showNavigation: true,
  stepsNavigation: true,
  prevBtnOnLastStep: true,
  dontValidate: false,
  preventEnterSubmission: false,
  startAtStep: 0,
  nextButtonText: "Next",
  nextButtonCls: "btn btn-prev btn-primary btn-lg pull-right",
  backButtonText: "Previous",
  backButtonCls: "btn btn-next btn-primary btn-lg pull-left",
  hocValidationAppliedTo: [],
  isReady: true,
  disabledSteps: [],
  disableBackButton: false
};

StepZilla.propTypes = {
  steps: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    component: _propTypes2.default.element.isRequired
  })).isRequired,
  showSteps: _propTypes2.default.bool,
  showNavigation: _propTypes2.default.bool,
  stepsNavigation: _propTypes2.default.bool,
  prevBtnOnLastStep: _propTypes2.default.bool,
  dontValidate: _propTypes2.default.bool,
  preventEnterSubmission: _propTypes2.default.bool,
  startAtStep: _propTypes2.default.number,
  nextButtonText: _propTypes2.default.string,
  nextButtonCls: _propTypes2.default.string,
  backButtonCls: _propTypes2.default.string,
  backButtonText: _propTypes2.default.string,
  hocValidationAppliedTo: _propTypes2.default.array,
  onStepChange: _propTypes2.default.func,
  isReady: _propTypes2.default.bool,
  disabledSteps: _propTypes2.default.array,
  disableBackButton: _propTypes2.default.bool
};