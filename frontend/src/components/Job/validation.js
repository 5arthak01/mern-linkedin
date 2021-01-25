import * as Yup from 'yup';

export const jobFormSchema = Yup.object({
	text: Yup.string()
		.min(5, 'Must be 5 characters at minimum')
		.max(300, 'Must be 300 characters or less')
		.required('Required')
});

export const sopSchema = Yup.object({
	SOP: Yup.string()
		.min(1, 'Must be 1 character at minimum')
		.max(250, 'Must be 250 characters or less')
		.required('Required')
});
