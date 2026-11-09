import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Criar conta" />
            <div className="mb-7">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2e8] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#527455] uppercase dark:bg-[#29463b] dark:text-[#d1e6cf]">
                    <UserRound size={12} />
                    Faça parte da agenda
                </span>
                <h1 className="mt-4 font-serif text-[38px] leading-tight tracking-[-0.06em] text-[#17383a] sm:text-[42px] dark:text-[#f3f0e5]">
                    Crie sua conta.
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#748078] dark:text-[#b2c0ba]">
                    Cadastre-se como organizador e divulgue seus eventos em
                    Campo Grande.
                </p>
            </div>
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]"
                                >
                                    Nome completo
                                </Label>
                                <div className="relative">
                                    <UserRound
                                        size={16}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                    />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Seu nome completo"
                                        className="h-12 rounded-xl border-[#e2e4da] bg-white pl-10 text-sm text-[#254542] placeholder:text-[#9aa39a] focus-visible:border-[#86a083] focus-visible:ring-[#86a083]/20 dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]"
                                >
                                    E-mail
                                </Label>
                                <div className="relative">
                                    <Mail
                                        size={16}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a9a8f]"
                                    />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="voce@exemplo.com"
                                        className="h-12 rounded-xl border-[#e2e4da] bg-white pl-10 text-sm text-[#254542] placeholder:text-[#9aa39a] focus-visible:border-[#86a083] focus-visible:ring-[#86a083]/20 dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]"
                                >
                                    Senha
                                </Label>
                                <div className="relative">
                                    <LockKeyhole
                                        size={16}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-[#8a9a8f]"
                                    />
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Crie uma senha"
                                        passwordrules={passwordRules}
                                        className="h-12 rounded-xl border-[#e2e4da] bg-white pr-11 pl-10 text-sm text-[#254542] placeholder:text-[#9aa39a] focus-visible:border-[#86a083] focus-visible:ring-[#86a083]/20 dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs font-semibold text-[#34534b] dark:text-[#e1e8dc]"
                                >
                                    Confirme sua senha
                                </Label>
                                <div className="relative">
                                    <LockKeyhole
                                        size={16}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-[#8a9a8f]"
                                    />
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Digite a senha novamente"
                                        passwordrules={passwordRules}
                                        className="h-12 rounded-xl border-[#e2e4da] bg-white pr-11 pl-10 text-sm text-[#254542] placeholder:text-[#9aa39a] focus-visible:border-[#86a083] focus-visible:ring-[#86a083]/20 dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={5}
                                data-test="register-user-button"
                                className="mt-1 h-12 w-full rounded-xl bg-[#193b3c] text-sm font-semibold text-white shadow-[0_8px_20px_-14px_#193b3c] transition hover:bg-[#285552] dark:bg-[#d96341] dark:text-white dark:hover:bg-[#bf5537]"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Criando conta...
                                    </>
                                ) : (
                                    <>
                                        Criar conta de organizador
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="border-t border-[#e9e7dd] pt-5 text-center dark:border-[#38544e]">
                            <p className="text-sm text-[#748078] dark:text-[#b2c0ba]">
                                Já tem uma conta?{' '}
                                <Link
                                    href={login()}
                                    tabIndex={6}
                                    className="font-semibold text-[#bd5738] transition hover:text-[#8f412d]"
                                >
                                    Entrar
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Criar conta',
    description: 'Cadastre-se para divulgar seus eventos em Campo Grande.',
};
