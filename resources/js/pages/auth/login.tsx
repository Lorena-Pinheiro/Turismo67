import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, Leaf, LockKeyhole, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Entrar" />

            <div className="mb-7">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2e8] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#527455] uppercase dark:bg-[#29463b] dark:text-[#d1e6cf]">
                    <Leaf size={12} />
                    Que bom ter você por aqui
                </span>
                <h1 className="mt-4 font-serif text-[38px] leading-tight tracking-[-0.06em] text-[#17383a] sm:text-[42px] dark:text-[#f3f0e5]">
                    Entre na sua conta.
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#748078] dark:text-[#b2c0ba]">
                    Acesse seus eventos e continue vivendo Campo Grande.
                </p>
            </div>

            {status && (
                <p
                    role="status"
                    className="mb-5 rounded-xl border border-[#d6e8d4] bg-[#edf5eb] px-4 py-3 text-sm text-[#416849] dark:border-[#42624a] dark:bg-[#29463b] dark:text-[#d1e6cf]"
                >
                    {status}
                </p>
            )}

            <PasskeyVerify
                label="Entrar com uma chave de acesso"
                loadingLabel="Verificando sua chave..."
                separator="ou entre com seu e-mail"
            />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
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
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
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
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Digite sua senha"
                                    className="h-12 rounded-xl border-[#e2e4da] bg-white pr-11 pl-10 text-sm text-[#254542] placeholder:text-[#9aa39a] focus-visible:border-[#86a083] focus-visible:ring-[#86a083]/20 dark:border-[#425c55] dark:bg-[#203d39] dark:text-[#f3f0e5]"
                                />
                            </div>
                            <InputError message={errors.password} />
                            {canResetPassword && (
                                <Link
                                    href={request()}
                                    className="self-end text-xs font-semibold text-[#bd5738] transition hover:text-[#8f412d]"
                                >
                                    Esqueci minha senha
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                className="rounded border-[#cbd4c8] data-[state=checked]:border-[#527455] data-[state=checked]:bg-[#527455]"
                            />
                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-xs font-medium text-[#68796f] dark:text-[#c1cec3]"
                            >
                                Manter conectado
                            </Label>
                        </div>

                        {errors.error && (
                            <p
                                role="alert"
                                className="rounded-xl border border-[#f0d7d1] bg-[#fff1ee] px-4 py-3 text-sm text-[#9d4e42] dark:border-[#644740] dark:bg-[#4a3431] dark:text-[#f1c3b5]"
                            >
                                {errors.error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="login-button"
                            className="mt-1 h-12 w-full rounded-xl bg-[#193b3c] text-sm font-semibold text-white shadow-[0_8px_20px_-14px_#193b3c] transition hover:bg-[#285552] dark:bg-[#d96341] dark:text-white dark:hover:bg-[#bf5537]"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </Button>
                    </>
                )}
            </Form>

            <div className="mt-7 border-t border-[#e9e7dd] pt-5 text-center dark:border-[#38544e]">
                <p className="text-sm text-[#748078] dark:text-[#b2c0ba]">
                    Ainda não tem uma conta?{' '}
                    <Link
                        href={register()}
                        className="font-semibold text-[#bd5738] transition hover:text-[#8f412d]"
                    >
                        Cadastre-se
                    </Link>
                </p>
                <Link
                    href={home()}
                    className="mt-4 inline-block text-xs font-medium text-[#809087] transition hover:text-[#bd5738] dark:text-[#aebcb7]"
                >
                    Continuar como visitante
                </Link>
            </div>
        </>
    );
}
