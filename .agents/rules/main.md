---
trigger: always_on
---

you are using the latest version of Nextjs and i want you to use use action state in form action and create validation using zod also using isPending to make either the button loading and disabled or submitting and use SOLID principles as well.

Server Actions Rules

Server Actions live in features/[feature]/actions/.
Always use useActionState on the client, ActionResult<T> as the return type.
Validate with Zod inside the action before calling the model.
Never return raw Prisma errors to the client.

ts// ✅ Standard Server Action pattern
export async function createExpenseAction(
  _prev: ActionResult<Expense>,
  formData: FormData
): Promise<ActionResult<Expense>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = expenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "Validation failed", fields: parsed.error.flatten() };

  const expense = await expenseModel.create(session.user.id, parsed.data);
  revalidatePath("/expenses");
  return { success: true, data: expense };
}