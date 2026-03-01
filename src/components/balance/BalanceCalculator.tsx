import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import {
  Calculator,
  Delete,
  FlaskConical,
  History,
  Info,
  RotateCcw,
  Sigma,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

type CalculatorMode = "normal" | "scientific";
type BinaryOperator = "+" | "-" | "*" | "/" | "^";
type UnaryToken = "SQUARE" | "SQRT" | "INVERSE";
type MemoryToken = "MC" | "MR" | "M_PLUS" | "M_MINUS";
type ButtonRole = "number" | "operator" | "utility" | "equal" | "science";

type HistoryEntry = {
  id: number;
  statement: string;
  result: string;
};

type CalculatorKey = {
  token: string;
  label: string;
  ariaLabel: string;
  role: ButtonRole;
  colSpan?: 1 | 2;
};

type ScenarioPreset = {
  id: string;
  label: string;
  description: string;
  apply: (currentValue: number, baselineValue: number) => number;
};

const DISPLAY_MAX_DIGITS = 16;
const DISPLAY_MAX_DECIMALS = 8;
const HISTORY_LIMIT = 7;

const OPERATOR_SYMBOL: Record<BinaryOperator, string> = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
  "^": "^",
};

const BASIC_KEYS: CalculatorKey[] = [
  {
    token: "AC",
    label: "AC",
    ariaLabel: "Clear simulation",
    role: "utility",
  },
  {
    token: "BACKSPACE",
    label: "⌫",
    ariaLabel: "Delete last digit",
    role: "utility",
  },
  {
    token: "TOGGLE_SIGN",
    label: "±",
    ariaLabel: "Toggle sign",
    role: "utility",
  },
  {
    token: "PERCENT",
    label: "%",
    ariaLabel: "Convert to percent",
    role: "utility",
  },
  { token: "7", label: "7", ariaLabel: "Number 7", role: "number" },
  { token: "8", label: "8", ariaLabel: "Number 8", role: "number" },
  { token: "9", label: "9", ariaLabel: "Number 9", role: "number" },
  { token: "/", label: "÷", ariaLabel: "Divide", role: "operator" },
  { token: "4", label: "4", ariaLabel: "Number 4", role: "number" },
  { token: "5", label: "5", ariaLabel: "Number 5", role: "number" },
  { token: "6", label: "6", ariaLabel: "Number 6", role: "number" },
  { token: "*", label: "×", ariaLabel: "Multiply", role: "operator" },
  { token: "1", label: "1", ariaLabel: "Number 1", role: "number" },
  { token: "2", label: "2", ariaLabel: "Number 2", role: "number" },
  { token: "3", label: "3", ariaLabel: "Number 3", role: "number" },
  { token: "-", label: "−", ariaLabel: "Subtract", role: "operator" },
  {
    token: "0",
    label: "0",
    ariaLabel: "Number 0",
    role: "number",
    colSpan: 2,
  },
  { token: ".", label: ".", ariaLabel: "Decimal point", role: "number" },
  { token: "+", label: "+", ariaLabel: "Add", role: "operator" },
  { token: "=", label: "=", ariaLabel: "Calculate result", role: "equal" },
];

const SCIENTIFIC_KEYS: CalculatorKey[] = [
  {
    token: "SQUARE",
    label: "x²",
    ariaLabel: "Square value",
    role: "science",
  },
  {
    token: "SQRT",
    label: "√x",
    ariaLabel: "Square root",
    role: "science",
  },
  {
    token: "INVERSE",
    label: "1/x",
    ariaLabel: "Multiplicative inverse",
    role: "science",
  },
  { token: "^", label: "xʸ", ariaLabel: "Power", role: "science" },
  { token: "MC", label: "mc", ariaLabel: "Clear memory", role: "science" },
  { token: "MR", label: "mr", ariaLabel: "Recall memory", role: "science" },
  {
    token: "M_PLUS",
    label: "m+",
    ariaLabel: "Add to memory",
    role: "science",
  },
  {
    token: "M_MINUS",
    label: "m-",
    ariaLabel: "Subtract from memory",
    role: "science",
  },
];

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "rise-five",
    label: "+5%",
    description: "Conservative growth scenario",
    apply: (currentValue) => currentValue * 1.05,
  },
  {
    id: "drop-five",
    label: "-5%",
    description: "Light adjustment scenario",
    apply: (currentValue) => currentValue * 0.95,
  },
  {
    id: "rise-fifteen",
    label: "+15%",
    description: "Accelerated growth scenario",
    apply: (currentValue) => currentValue * 1.15,
  },
  {
    id: "drop-fifteen",
    label: "-15%",
    description: "Contraction scenario",
    apply: (currentValue) => currentValue * 0.85,
  },
  {
    id: "break-even",
    label: "0",
    description: "Simulate break-even point",
    apply: () => 0,
  },
  {
    id: "baseline",
    label: "Baseline",
    description: "Return to initial balance",
    apply: (_, baselineValue) => baselineValue,
  },
];

const KEYBOARD_TOKEN_MAP: Record<string, string> = {
  Enter: "=",
  "=": "=",
  Escape: "AC",
  Backspace: "BACKSPACE",
  "%": "PERCENT",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  ".": ".",
};

function normalizeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const rounded = Number(value.toFixed(DISPLAY_MAX_DECIMALS));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function toDisplayValue(value: number): string {
  const normalized = normalizeNumber(value);
  if (!Number.isFinite(normalized)) {
    return "Error";
  }

  const asString = normalized.toString();
  if (asString.includes("e")) {
    return normalized.toFixed(DISPLAY_MAX_DECIMALS).replace(/\.?0+$/, "");
  }

  return asString;
}

function parseDisplayValue(displayValue: string): number {
  const parsed = Number(displayValue);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
}

function formatDisplayValue(displayValue: string): string {
  if (displayValue === "Error") {
    return displayValue;
  }

  const isNegative = displayValue.startsWith("-");
  const unsignedValue = isNegative ? displayValue.slice(1) : displayValue;
  const [integerPartRaw = "0", decimalPart] = unsignedValue.split(".");
  const safeIntegerPart = integerPartRaw === "" ? "0" : integerPartRaw;
  const groupedInteger = safeIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const signPrefix = isNegative ? "-" : "";

  if (decimalPart !== undefined) {
    return `${signPrefix}${groupedInteger}.${decimalPart}`;
  }

  return `${signPrefix}${groupedInteger}`;
}

function formatOperationValue(value: number): string {
  return formatDisplayValue(toDisplayValue(value));
}

function formatDeltaPercentage(
  deltaValue: number,
  baselineValue: number
): string | null {
  if (baselineValue === 0) {
    return null;
  }

  const deltaPercentage = (deltaValue / Math.abs(baselineValue)) * 100;
  return `${deltaPercentage >= 0 ? "+" : ""}${deltaPercentage.toFixed(2)}%`;
}

function computeBinaryResult(
  leftValue: number,
  rightValue: number,
  operator: BinaryOperator
): number | null {
  switch (operator) {
    case "+":
      return normalizeNumber(leftValue + rightValue);
    case "-":
      return normalizeNumber(leftValue - rightValue);
    case "*":
      return normalizeNumber(leftValue * rightValue);
    case "/":
      if (rightValue === 0) {
        return null;
      }
      return normalizeNumber(leftValue / rightValue);
    case "^":
      return normalizeNumber(Math.pow(leftValue, rightValue));
    default:
      return null;
  }
}

function computeUnaryResult(
  value: number,
  token: UnaryToken
): { result: number | null; statement: string } {
  if (token === "SQUARE") {
    return {
      result: normalizeNumber(value * value),
      statement: `(${formatOperationValue(value)})²`,
    };
  }

  if (token === "SQRT") {
    if (value < 0) {
      return { result: null, statement: "√x" };
    }

    return {
      result: normalizeNumber(Math.sqrt(value)),
      statement: `√(${formatOperationValue(value)})`,
    };
  }

  if (value === 0) {
    return { result: null, statement: "1/x" };
  }

  return {
    result: normalizeNumber(1 / value),
    statement: `1/(${formatOperationValue(value)})`,
  };
}

function getButtonVariant(role: ButtonRole) {
  if (role === "number") {
    return "outline";
  }

  if (role === "utility" || role === "science") {
    return "secondary";
  }

  return "default";
}

function getButtonClassName(role: ButtonRole) {
  if (role === "number") {
    return "h-13 rounded-2xl text-lg font-semibold";
  }

  if (role === "utility") {
    return "h-13 rounded-2xl text-base font-medium";
  }

  if (role === "science") {
    return "h-11 rounded-xl text-sm font-medium";
  }

  if (role === "equal") {
    return "h-13 rounded-2xl text-lg font-bold";
  }

  return "h-13 rounded-2xl text-lg font-semibold";
}

function isFormElement(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  if (!element) {
    return false;
  }

  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT" ||
    element.isContentEditable
  );
}

export function BalanceCalculator() {
  const userEmail = useRouteUser();
  const historyIdRef = useRef(0);

  const [mode, setMode] = useState<CalculatorMode>("normal");
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("Initial balance");
  const [pendingOperator, setPendingOperator] = useState<BinaryOperator | null>(
    null
  );
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memoryValue, setMemoryValue] = useState(0);
  const [baselineBalance, setBaselineBalance] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState(
    "Calculator ready to simulate scenarios."
  );

  const initialBalanceRef = useRef(0);
  const initialDisplayRef = useRef("0");
  const hasInitializedBalanceRef = useRef(false);

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: Boolean(userEmail),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    const fetchedBalance = Number(data?.data?.totalBalance ?? 0);

    if (!Number.isFinite(fetchedBalance) || hasInitializedBalanceRef.current) {
      return;
    }

    const normalizedBalance = normalizeNumber(fetchedBalance);
    const seededDisplay = toDisplayValue(normalizedBalance);

    initialBalanceRef.current = normalizedBalance;
    initialDisplayRef.current = seededDisplay;
    hasInitializedBalanceRef.current = true;

    setBaselineBalance(normalizedBalance);
    setDisplay(seededDisplay);
    setExpression("Initial balance");
    setStatusMessage("Simulation started with your current total balance.");
  }, [data?.data?.totalBalance]);

  const pushHistory = useCallback(
    (statement: string, resultDisplay: string) => {
      setHistory((previousHistory) => {
        const nextEntry: HistoryEntry = {
          id: historyIdRef.current++,
          statement,
          result: formatDisplayValue(resultDisplay),
        };

        return [nextEntry, ...previousHistory].slice(0, HISTORY_LIMIT);
      });
    },
    []
  );

  const setErrorState = useCallback((message: string) => {
    setDisplay("Error");
    setExpression("Invalid operation");
    setPendingOperator(null);
    setStoredValue(null);
    setWaitingForOperand(true);
    setStatusMessage(message);
  }, []);

  const resetToBaseline = useCallback(
    (storeInHistory = false) => {
      const baselineDisplay = initialDisplayRef.current;
      const baselineNumber = initialBalanceRef.current;

      setDisplay(baselineDisplay);
      setExpression("Initial balance");
      setPendingOperator(null);
      setStoredValue(null);
      setWaitingForOperand(false);
      setStatusMessage("Simulation reset to the initial balance.");

      if (storeInHistory) {
        pushHistory("Reset to baseline", baselineDisplay);
      }

      if (baselineBalance !== baselineNumber) {
        setBaselineBalance(baselineNumber);
      }
    },
    [baselineBalance, pushHistory]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (!/^\d$/.test(digit)) {
        return;
      }

      setDisplay((previousDisplay) => {
        const baseDisplay =
          waitingForOperand || previousDisplay === "Error"
            ? ""
            : previousDisplay;

        const [integerPart = "", decimalPart = ""] = baseDisplay.split(".");
        const integerLength = integerPart.replace("-", "").length;
        const decimalLength = decimalPart.length;

        if (
          (!baseDisplay.includes(".") && integerLength >= DISPLAY_MAX_DIGITS) ||
          (baseDisplay.includes(".") && decimalLength >= DISPLAY_MAX_DECIMALS)
        ) {
          setStatusMessage("Digit limit reached.");
          return previousDisplay;
        }

        if (baseDisplay === "" || baseDisplay === "0") {
          return digit;
        }

        if (baseDisplay === "-0") {
          return `-${digit}`;
        }

        return `${baseDisplay}${digit}`;
      });

      setWaitingForOperand(false);
      setStatusMessage(`Number ${digit} added.`);
    },
    [waitingForOperand]
  );

  const handleDecimal = useCallback(() => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      setStatusMessage("Decimal point added.");
      return;
    }

    if (display.includes(".")) {
      return;
    }

    setDisplay((previousDisplay) => `${previousDisplay}.`);
    setStatusMessage("Decimal point added.");
  }, [display, waitingForOperand]);

  const handleBackspace = useCallback(() => {
    if (display === "Error" || waitingForOperand) {
      return;
    }

    setDisplay((previousDisplay) => {
      if (
        previousDisplay.length <= 1 ||
        (previousDisplay.startsWith("-") && previousDisplay.length === 2)
      ) {
        return "0";
      }

      return previousDisplay.slice(0, -1);
    });

    setStatusMessage("Last digit deleted.");
  }, [display, waitingForOperand]);

  const handleToggleSign = useCallback(() => {
    if (display === "Error" || display === "0" || display === "0.") {
      return;
    }

    setDisplay((previousDisplay) =>
      previousDisplay.startsWith("-")
        ? previousDisplay.slice(1)
        : `-${previousDisplay}`
    );
    setStatusMessage("Sign toggled.");
  }, [display]);

  const handlePercent = useCallback(() => {
    if (display === "Error") {
      return;
    }

    const currentValue = parseDisplayValue(display);
    const resultValue = normalizeNumber(currentValue / 100);
    const resultDisplay = toDisplayValue(resultValue);
    const statement = `${formatOperationValue(currentValue)}%`;

    setDisplay(resultDisplay);
    setExpression(statement);
    setWaitingForOperand(true);
    setStatusMessage("Percentage applied.");
    pushHistory(statement, resultDisplay);
  }, [display, pushHistory]);

  const handleUnaryOperation = useCallback(
    (token: UnaryToken) => {
      if (display === "Error") {
        return;
      }

      const currentValue = parseDisplayValue(display);
      const { result, statement } = computeUnaryResult(currentValue, token);

      if (result === null) {
        setErrorState("Scientific operation is not valid for current value.");
        return;
      }

      const resultDisplay = toDisplayValue(result);

      setDisplay(resultDisplay);
      setExpression(statement);
      setWaitingForOperand(true);
      setStatusMessage("Scientific operation applied.");
      pushHistory(statement, resultDisplay);
    },
    [display, pushHistory, setErrorState]
  );

  const handleMemoryOperation = useCallback(
    (token: MemoryToken) => {
      const currentValue = display === "Error" ? 0 : parseDisplayValue(display);

      if (token === "MC") {
        setMemoryValue(0);
        setStatusMessage("Memory cleared.");
        return;
      }

      if (token === "MR") {
        const memoryDisplay = toDisplayValue(memoryValue);
        setDisplay(memoryDisplay);
        setExpression("Memory recalled");
        setWaitingForOperand(true);
        setStatusMessage("Memory value recalled.");
        return;
      }

      if (token === "M_PLUS") {
        setMemoryValue((previousValue) =>
          normalizeNumber(previousValue + currentValue)
        );
        setStatusMessage("Value added to memory.");
        return;
      }

      setMemoryValue((previousValue) =>
        normalizeNumber(previousValue - currentValue)
      );
      setStatusMessage("Value subtracted from memory.");
    },
    [display, memoryValue]
  );

  const handleOperator = useCallback(
    (operator: BinaryOperator) => {
      if (display === "Error") {
        return;
      }

      const currentValue = parseDisplayValue(display);

      if (storedValue === null) {
        setStoredValue(currentValue);
        setPendingOperator(operator);
        setWaitingForOperand(true);
        setExpression(
          `${formatOperationValue(currentValue)} ${OPERATOR_SYMBOL[operator]}`
        );
        setStatusMessage(`Operator ${OPERATOR_SYMBOL[operator]} ready.`);
        return;
      }

      if (pendingOperator && !waitingForOperand) {
        const result = computeBinaryResult(
          storedValue,
          currentValue,
          pendingOperator
        );

        if (result === null) {
          setErrorState("Cannot divide by zero.");
          return;
        }

        const resultDisplay = toDisplayValue(result);
        setDisplay(resultDisplay);
        setStoredValue(result);
        setExpression(
          `${formatOperationValue(storedValue)} ${OPERATOR_SYMBOL[pendingOperator]} ${formatOperationValue(currentValue)}`
        );
      }

      setPendingOperator(operator);
      setWaitingForOperand(true);
      setStatusMessage(`Operator ${OPERATOR_SYMBOL[operator]} ready.`);
    },
    [display, pendingOperator, setErrorState, storedValue, waitingForOperand]
  );

  const handleEqual = useCallback(() => {
    if (
      display === "Error" ||
      pendingOperator === null ||
      storedValue === null ||
      waitingForOperand
    ) {
      return;
    }

    const currentValue = parseDisplayValue(display);
    const result = computeBinaryResult(
      storedValue,
      currentValue,
      pendingOperator
    );

    if (result === null) {
      setErrorState("Cannot divide by zero.");
      return;
    }

    const resultDisplay = toDisplayValue(result);
    const statement = `${formatOperationValue(storedValue)} ${OPERATOR_SYMBOL[pendingOperator]} ${formatOperationValue(currentValue)}`;

    setDisplay(resultDisplay);
    setExpression(statement);
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
    setStatusMessage(`Result ${formatDisplayValue(resultDisplay)}.`);
    pushHistory(statement, resultDisplay);
  }, [
    display,
    pendingOperator,
    pushHistory,
    setErrorState,
    storedValue,
    waitingForOperand,
  ]);

  const applyScenario = useCallback(
    (preset: ScenarioPreset) => {
      const sourceValue =
        display === "Error" ? baselineBalance : parseDisplayValue(display);
      const scenarioValue = normalizeNumber(
        preset.apply(sourceValue, initialBalanceRef.current)
      );
      const scenarioDisplay = toDisplayValue(scenarioValue);
      const statement = `Scenario ${preset.label}`;

      setDisplay(scenarioDisplay);
      setExpression(statement);
      setWaitingForOperand(true);
      setStatusMessage(`${preset.description}.`);
      pushHistory(statement, scenarioDisplay);
    },
    [baselineBalance, display, pushHistory]
  );

  const handleInputToken = useCallback(
    (token: string) => {
      if (/^\d$/.test(token)) {
        handleDigit(token);
        return;
      }

      if (token === ".") {
        handleDecimal();
        return;
      }

      if (token === "AC") {
        resetToBaseline(true);
        return;
      }

      if (token === "BACKSPACE") {
        handleBackspace();
        return;
      }

      if (token === "TOGGLE_SIGN") {
        handleToggleSign();
        return;
      }

      if (token === "PERCENT") {
        handlePercent();
        return;
      }

      if (token === "=") {
        handleEqual();
        return;
      }

      if (
        token === "+" ||
        token === "-" ||
        token === "*" ||
        token === "/" ||
        token === "^"
      ) {
        handleOperator(token);
        return;
      }

      if (token === "SQUARE" || token === "SQRT" || token === "INVERSE") {
        handleUnaryOperation(token);
        return;
      }

      if (
        token === "MC" ||
        token === "MR" ||
        token === "M_PLUS" ||
        token === "M_MINUS"
      ) {
        handleMemoryOperation(token);
      }
    },
    [
      handleBackspace,
      handleDecimal,
      handleDigit,
      handleEqual,
      handleMemoryOperation,
      handleOperator,
      handlePercent,
      handleToggleSign,
      handleUnaryOperation,
      resetToBaseline,
    ]
  );

  useEffect(() => {
    const handleKeyboardInput = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isFormElement(event.target)
      ) {
        return;
      }

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        handleInputToken(event.key);
        return;
      }

      const mappedToken = KEYBOARD_TOKEN_MAP[event.key];
      if (!mappedToken) {
        return;
      }

      event.preventDefault();
      handleInputToken(mappedToken);
    };

    window.addEventListener("keydown", handleKeyboardInput);
    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [handleInputToken]);

  const visibleKeys = useMemo(
    () =>
      mode === "scientific" ? [...SCIENTIFIC_KEYS, ...BASIC_KEYS] : BASIC_KEYS,
    [mode]
  );

  const displayLabel = useMemo(() => formatDisplayValue(display), [display]);

  const simulatedValue = useMemo(
    () => (display === "Error" ? 0 : parseDisplayValue(display)),
    [display]
  );

  const deltaValue = useMemo(
    () => normalizeNumber(simulatedValue - baselineBalance),
    [baselineBalance, simulatedValue]
  );

  const deltaPercentageLabel = useMemo(
    () => formatDeltaPercentage(deltaValue, baselineBalance),
    [baselineBalance, deltaValue]
  );

  const deltaValueLabel = useMemo(
    () => formatCurrency(deltaValue, "USD"),
    [deltaValue]
  );

  const baselineBalanceLabel = useMemo(
    () => formatCurrency(baselineBalance, "USD"),
    [baselineBalance]
  );

  const simulatedBalanceLabel = useMemo(
    () => formatCurrency(simulatedValue, "USD"),
    [simulatedValue]
  );

  if (!userEmail) {
    return (
      <Alert variant="destructive">
        <Info className="size-4" />
        <AlertTitle>User session not found</AlertTitle>
        <AlertDescription>
          Sign in again to use the balance calculator.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Info className="size-4" />
        <AlertTitle>Unable to load your balance</AlertTitle>
        <AlertDescription>
          This view does not change real data, but it needs your current balance
          to initialize the simulation.
        </AlertDescription>
      </Alert>
    );
  }

  if (isPending && !hasInitializedBalanceRef.current) {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <Skeleton className="h-152 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="border-primary/25 bg-primary/5">
        <Info className="size-4" />
        <AlertTitle>Safe simulation</AlertTitle>
        <AlertDescription>
          This calculator uses a static copy of your{" "}
          <strong>Total Balance</strong>. No calculation updates your real
          balance or saves data to the database.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <Card className="relative overflow-hidden border-border/70 bg-linear-to-br from-card via-card to-primary/5">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />

          <CardHeader className="relative space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="size-4" aria-hidden="true" />
                  Balance Calculator
                </CardTitle>
                <CardDescription>
                  Mobile-first, with keyboard support and scientific mode.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => resetToBaseline(true)}
                className="shrink-0"
                aria-label="Reset to initial balance"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>

            <Tabs
              value={mode}
              onValueChange={(nextValue) =>
                setMode((nextValue as CalculatorMode) || "normal")
              }
              className="w-full"
            >
              <TabsList className="h-9 w-full">
                <TabsTrigger value="normal">Normal</TabsTrigger>
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div
              className={cn(
                "rounded-2xl border border-border/70 bg-background/85 p-4 text-right shadow-inner",
                display === "Error" && "border-destructive/50 text-destructive"
              )}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-xs text-muted-foreground break-all">
                {expression}
              </p>
              <p className="mt-1 text-[2.15rem] font-semibold leading-tight break-all sm:text-5xl">
                {displayLabel}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {visibleKeys.map((keyConfig) => (
                <Button
                  key={keyConfig.token}
                  type="button"
                  variant={getButtonVariant(keyConfig.role)}
                  onClick={() => handleInputToken(keyConfig.token)}
                  aria-label={keyConfig.ariaLabel}
                  className={cn(
                    getButtonClassName(keyConfig.role),
                    keyConfig.colSpan === 2 && "col-span-2"
                  )}
                >
                  {keyConfig.label}
                </Button>
              ))}
            </div>

            <p className="sr-only" aria-live="polite">
              {statusMessage}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FlaskConical className="size-4" aria-hidden="true" />
                Balance scenarios
              </CardTitle>
              <CardDescription>
                Adjust simulation quickly without affecting real data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Base balance (real)</dt>
                  <dd className="font-medium">{baselineBalanceLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Simulated balance</dt>
                  <dd className="font-medium">{simulatedBalanceLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Difference</dt>
                  <dd
                    className={cn(
                      "font-semibold",
                      deltaValue > 0 &&
                        "text-emerald-600 dark:text-emerald-400",
                      deltaValue < 0 && "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {deltaValue >= 0 ? "+" : ""}
                    {deltaValueLabel}
                  </dd>
                </div>
                {deltaPercentageLabel && (
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted-foreground">Variation</dt>
                    <dd
                      className={cn(
                        "font-medium",
                        deltaValue > 0 &&
                          "text-emerald-600 dark:text-emerald-400",
                        deltaValue < 0 && "text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {deltaPercentageLabel}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="grid grid-cols-2 gap-2">
                {SCENARIO_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="outline"
                    aria-label={preset.description}
                    onClick={() => applyScenario(preset)}
                    size={"lg"}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sigma className="size-3.5" aria-hidden="true" />
                Current memory: {formatOperationValue(memoryValue)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4" aria-hidden="true" />
                Local history
              </CardTitle>
              <CardDescription>
                Latest operations from this simulation session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No operations registered yet.
                </div>
              ) : (
                <ol className="scrollbar-custom max-h-64 space-y-2 overflow-y-auto pr-1">
                  {history.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-xl border bg-muted/40 px-3 py-2"
                    >
                      <p className="text-xs text-muted-foreground">
                        {entry.statement}
                      </p>
                      <p className="text-sm font-medium">{entry.result}</p>
                    </li>
                  ))}
                </ol>
              )}

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="mt-3 w-full"
                onClick={() => setHistory([])}
                disabled={history.length === 0}
                aria-label="Clear local history"
              >
                <Delete className="size-4" />
                Clear history
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="text-base">Available shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline">0-9</Badge>
              <Badge variant="outline">+ - * /</Badge>
              <Badge variant="outline">Enter =</Badge>
              <Badge variant="outline">Backspace</Badge>
              <Badge variant="outline">Esc (reset)</Badge>
              <Badge variant="outline">.</Badge>
              <Badge variant="outline">%</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
