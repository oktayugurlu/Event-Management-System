package com.etkinlikyonetimi.intern.usecases.manageevent.entity;

import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "corporate_user")
@SequenceGenerator(name = "idgen", sequenceName = "corporate_user_seq")
public class CorporateUser extends BaseEntity implements UserDetails, CredentialsContainer {

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "user_password")
    private String password;

    //Bi directional fields
    @OneToMany(mappedBy = "corporateUser", cascade = CascadeType.ALL)
    private Set<Event> eventSet;

    @Override
    public void eraseCredentials() {

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
