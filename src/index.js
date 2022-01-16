import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;

const refs = {
  inputForm: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputForm.addEventListener(
  'input',
  debounce(event => {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    if (event.target.value.trim() !== '') {
      fetchCountries(`${event.target.value}`.trim())
        .then(data => {
          if (data.length >= 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          } 
          if (data.length === 1) {
            createOneCountry(data, refs.countryInfo)
            // Notiflix.Notify.info('1');
            
          }
          if (data.length > 1 && data.length < 10) {
            createCountryList(data, refs.countryList);
            // Notiflix.Notify.info('up to 10');
          }
          

        })
        .catch(error => Notiflix.Notify.failure(`Oops, there is no country with that name`));
    }
  }, DEBOUNCE_DELAY),
);

function createOneCountry(data, node) {
  const markup = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<div><img src="${flags.svg}" alt="Country flag" width="250">
      <h2>${name.official}</h2>
      </div>
      <ul>
      <li><b>Capital: &nbsp</b> ${capital}</li>
      <li><b>Population: &nbsp</b> ${Intl.NumberFormat().format(
        population,
      )}</li>
      <li><b>Languages: &nbsp</b> ${Object.values(languages).join(', ')}</li>
      </ul>`;
    })
    .join('');

  node.innerHTML = markup;
}

function createCountryList(data, node) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li><img class="flag" src="${flags.svg}" alt="Country flag" width="50"><b>${name.official}</b></li>`;
    })
    .join('');

  node.innerHTML = markup;
}