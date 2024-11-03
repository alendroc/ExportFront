import Swal from 'sweetalert2';

export const showToast = (icon, title,background, position = 'top-end', timer = 6000, ) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    showCloseButton: true,
    timer: timer,
    background: background,
    color:'#ffff',
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({
    icon: icon,
    title: title
  });
};

export const showToastTable = (icon, title,background, position = 'top-end', timer = 3000, ) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    showCloseButton: true,
    timer: timer,
    background: background,
    color:'#ffff',
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({
    icon: icon,
    title: title
  });
};
