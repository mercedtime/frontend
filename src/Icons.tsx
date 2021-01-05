import React, { SVGProps } from "react";

export const NewBeginningsSVG = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg version="1.1" viewBox="0 0 281 304" {...props}>
      <title>New Beginnings logo</title>
      <g>
        <path d="M 20.652473,302.84747 C 2.6627596,301.87434 -1.9406775,300.63887 8.6268737,299.62004 18.098642,298.70685 60.848461,297.05358 75.75,297.02417 82.4875,297.01088 88,296.78671 88,296.52603 c 0,-0.26068 -1.287721,-3.74818 -2.861603,-7.75 C 76.781459,267.52733 69.473131,239.97867 65.964436,216.5 63.270733,198.4749 62.300863,166.83518 63.907234,149.38857 68.452185,100.02638 86.978072,54.894157 117.89376,17.868174 l 8.04232,-9.631826 7.78196,-2.0701822 c 14.22633,-3.7845336 17.2329,-4.3989701 18.72444,-3.826612 1.14082,0.4377739 -0.36581,3.6106039 -6.58342,13.8640692 -35.53351,58.598346 -51.731098,116.543207 -47.940501,171.501227 2.023356,29.33566 7.151901,53.89975 18.621981,89.19339 L 123.07341,297 h 17.33249 17.33248 l 4.68471,-12.45234 C 194.70685,198.73478 195.51267,158.42165 166.64176,73.5 163.08906,63.05 158.40621,49.967025 156.23543,44.426723 l -3.94689,-10.073278 8.54943,-4.926722 c 4.70219,-2.709698 10.70602,-6.16976 13.34186,-7.689026 l 4.79242,-2.762304 6.00516,11.979543 C 211.42167,83.707917 223.96329,139.34593 220.94118,190.5 c -1.83394,31.04233 -7.4562,57.17991 -19.84323,92.25 l -5.03321,14.25 11.71763,0.0242 c 6.4447,0.0133 22.51763,0.45371 35.71763,0.9787 43.43003,1.72729 47.94152,3.1668 15.44848,4.92928 -23.08804,1.25233 -214.839129,1.1842 -238.296007,-0.0847 z" />
      </g>
    </svg>
  );
};

export function EmptyUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 600 600"
      stroke={props.stroke || "black"}
      fill={props.fill || "none"}
      strokeWidth={props.strokeWidth || "30"}
      {...props}
    >
      <circle cx="300" cy="300" r="265" />
      <circle cx="300" cy="230" r="115" />
      <path
        d="M106.81863443903,481.4 a205,205 1 0,1 386.36273112194,0"
        strokeLinecap="butt"
      />
    </svg>
  );
}

export const ChevronIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 185.343 185.343"
      xmlSpace="preserve"
      {...props}
    >
      <g>
        <path
          d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
		l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
		c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"
        />
      </g>
    </svg>
  );
};

export const SignOutIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 24 24"
      width={props.width || "24px"}
      strokeWidth={props.strokeWidth || "1"}
      fill-rule="nonzero"
      {...props}
    >
      <g>
        <path d="M12,4.35416625 L12,4.99998545 L13.7452668,5 C14.1245178,5 14.4381068,5.28151791 14.488266,5.64711331 L14.4952658,5.74875738 L14.502,10 L13.002,10 L12.9965084,6.5 L12,6.49998545 L12.0005455,11.004946 L13.002,11.0039854 L13.003,11 L14.504,11 L14.503,11.0039854 L19.442,11.0039854 L17.7195786,9.28023872 C17.4533579,9.0139263 17.4292236,8.59725845 17.6471286,8.30368449 L17.7197613,8.21957857 C17.9860737,7.95335788 18.4027416,7.9292236 18.6963155,8.14712863 L18.7804214,8.21976128 L21.7770341,11.2174065 C22.043008,11.4834721 22.0673769,11.8996744 21.850009,12.19325 L21.7775464,12.2773711 L18.7809337,15.2808167 C18.4883742,15.5740433 18.0135008,15.5745841 17.7202742,15.2820246 C17.4537046,15.0160615 17.4290241,14.5994256 17.646544,14.3055662 L17.7190663,14.2213652 L19.432,12.5039854 L12.0005455,12.504946 L12,17.0009854 L13.0139075,17.0014475 L13.007,13.5 L14.508,13.5 L14.5151512,17.7502049 C14.5157801,18.130345 14.23351,18.4448141 13.8670368,18.4945857 L13.7651512,18.5014475 L12,18.5009854 L12,19.25 C12,19.7163948 11.5788385,20.0696886 11.1195525,19.9885685 L2.61955246,18.4872805 C2.26120966,18.4239892 2,18.1126012 2,17.748712 L2,5.75 C2,5.38269391 2.26601447,5.06943276 2.62846599,5.00991252 L11.128466,3.61407877 C11.5850805,3.53909548 12,3.89143598 12,4.35416625 Z M8.50214976,11.5 C7.94867773,11.5 7.5,11.9486777 7.5,12.5021498 C7.5,13.0556218 7.94867773,13.5042995 8.50214976,13.5042995 C9.05562179,13.5042995 9.50429953,13.0556218 9.50429953,12.5021498 C9.50429953,11.9486777 9.05562179,11.5 8.50214976,11.5 Z" />
      </g>
    </svg>
  );
};

export const SettingsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={props.width || "28px"}
      viewBox="0 0 28 28"
      {...props}
    >
      <g>
        <path d="M19.9818 21.6364L21.7093 22.3948C22.0671 22.5518 22.4849 22.4657 22.7517 22.1799C23.9944 20.8492 24.9198 19.2536 25.4586 17.5131C25.5748 17.1376 25.441 16.7296 25.1251 16.4965L23.5988 15.3698C23.1628 15.0489 22.9 14.5403 22.9 13.9994C22.9 13.4586 23.1628 12.95 23.5978 12.6297L25.1228 11.5035C25.4386 11.2703 25.5723 10.8623 25.4561 10.487C24.9172 8.74611 23.9912 7.1504 22.7478 5.81991C22.4807 5.53405 22.0626 5.44818 21.7048 5.60568L19.9843 6.36294C19.769 6.45838 19.5385 6.507 19.3055 6.50663C18.4387 6.50572 17.7116 5.85221 17.617 4.98937L17.4079 3.11017C17.3643 2.71823 17.077 2.39734 16.6928 2.31149C15.8128 2.11485 14.9147 2.01047 14.0131 2.00006C13.0891 2.01071 12.19 2.11504 11.3089 2.31138C10.9245 2.39704 10.637 2.71803 10.5933 3.11017L10.3844 4.98794C10.3244 5.52527 10.0133 6.00264 9.54617 6.27415C9.07696 6.54881 8.50793 6.58168 8.01296 6.36404L6.29276 5.60691C5.93492 5.44941 5.51684 5.53528 5.24971 5.82114C4.00637 7.15163 3.08038 8.74734 2.54142 10.4882C2.42513 10.8638 2.55914 11.272 2.87529 11.5051L4.40162 12.6306C4.83721 12.9512 5.09414 13.4598 5.09414 14.0007C5.09414 14.5415 4.83721 15.0501 4.40219 15.3703L2.8749 16.4977C2.55922 16.7307 2.42533 17.1384 2.54122 17.5137C3.07924 19.2561 4.00474 20.8536 5.24806 22.1859C5.51493 22.4718 5.93281 22.558 6.29071 22.4009L8.01859 21.6424C8.51117 21.4269 9.07783 21.4586 9.54452 21.7281C10.0112 21.9976 10.3225 22.4731 10.3834 23.0093L10.5908 24.8855C10.6336 25.273 10.9148 25.5917 11.2933 25.682C13.0725 26.1061 14.9263 26.1061 16.7055 25.682C17.084 25.5917 17.3651 25.273 17.408 24.8855L17.6157 23.0066C17.675 22.4693 17.9729 21.9924 18.44 21.7219C18.9071 21.4515 19.4876 21.4197 19.9818 21.6364ZM14 18C11.7909 18 10 16.2091 10 14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14C18 16.2091 16.2091 18 14 18Z" />
      </g>
    </svg>
  );
};
