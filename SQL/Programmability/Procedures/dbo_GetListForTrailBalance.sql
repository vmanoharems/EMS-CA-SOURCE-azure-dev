SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO




CREATE PROCEDURE [dbo].[GetListForTrailBalance] -- GetListForTrailBalance 3,'01','Detaillevel1','2015-04-22 09:40:29.333','2016-04-23 09:40:29.333'
@ProdId int,
@CompanyCode nvarchar(50),
@Segmentcode varchar(20),
@FromDate Date,
@ToDate Date


AS
BEGIN

if(@FromDate='1/1/0001')
begin
set @FromDate=GETDATE()
end
if(@ToDate='1/1/0001')
begin
set @ToDate=GETDATE()
end

declare @Data Table(Id int, COAString varchar(100), [Description] varchar(100), BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),CreatedDate datetime,AccountBal decimal(18,2))
declare @finalData Table(Id int, COAString varchar(100),[Description] varchar(100),  BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),CreatedDate datetime,AccountBal decimal(18,2))
declare @TrialBal Table(COAString varchar(100),[Description] varchar(100),  BeginingBal Decimal(18,2),CurrentActivity Decimal(18,2),AccountBal decimal(18,2))
declare @Segment int

if not exists (select *  from segment where classification=@SegmentCode)

begin
select @Segment=SegmentLevel  from segment where classification='Detail'
end
else 

begin
select @Segment=SegmentLevel  from segment where classification=@SegmentCode
end

If (@Segment=2)
begin

if (@SegmentCode='Detail Header')
begin

Insert Into @Data
select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+case when c.SS2 like '%>%' then SUBSTRING(c.SS2,0, CHARINDEX('>',c.SS2)) else c.SS4 end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.Detaillevel>0
 end

 else if (@SegmentCode='Detail Level1')
  begin
 Insert Into @Data

 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+case
when detaillevel in (3,4,5,6) then left(c.SS2, charindex('>', c.SS2, charindex('>', c.SS2)+1)-1)
when detaillevel=2 then c.SS2
end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.Detaillevel>1
end

else 

begin
 Insert Into @Data
 
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
end
 
 end
 else if (@Segment=3)
 begin
if (@SegmentCode='Detail Header')

begin
Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+case when c.SS3 like '%>%' then SUBSTRING(c.SS3,0, CHARINDEX('>',c.SS3)) else c.SS3 end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.detaillevel>0
end

else if (@SegmentCode='Detail Level1')

begin 
Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+case
when detaillevel in (3,4,5,6) then left(c.SS3, charindex('>', c.SS3, charindex('>', c.SS3)+1)-1)
when detaillevel=2 then c.SS3
end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.detaillevel>1
end

else

begin
 Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
 end
 end
  else if (@Segment=4)
  begin
  
if (@SegmentCode='Detail Header')

begin
  Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+case when c.SS4 like '%>%' then SUBSTRING(c.SS4,0, CHARINDEX('>',c.SS4)) else c.SS4 end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.detaillevel>0
end

else if (@SegmentCode='Detail Level1')

begin 

  Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+case
when detaillevel in (3,4,5,6) then left(c.SS4, charindex('>', c.SS4, charindex('>', c.SS4)+1)-1)
when detaillevel=2 then c.SS4
end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.detaillevel>1
end

else

begin
  Insert Into @Data
 select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+c.SS4 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
end
  end

   else if (@Segment=5)

   begin

     
if (@SegmentCode='Detail Header')

begin
   Insert Into @Data
    select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+c.SS4+'|'+case when c.SS5 like '%>%' then SUBSTRING(c.SS5,0, CHARINDEX('>',c.SS5)) else c.SS5 end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.detaillevel>0
end

else if (@SegmentCode='Detail Level1')

begin 
   Insert Into @Data
    select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+c.SS4+'|'+case
when detaillevel in (3,4,5,6) then left(c.SS5, charindex('>', c.SS5, charindex('>', c.SS5)+1)-1)
when detaillevel=2 then c.SS5
end as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
and c.detaillevel>1
end

else
begin
   Insert Into @Data
    select [RN] = Row_number() OVER (Order BY a.CreatedDate), c.SS1+'|'+c.SS2+'|'+c.SS3+'|'+c.SS4+'|'+c.SS5 as COAstring,d.AccountName ,0 as BeginingBal ,Case when DebitAmount>0 then (-1)*(DebitAmount) else CreditAmount End as CurrentActivity,a.CreatedDate,
 0 as AccountBal  from JournalEntryDetail  a 
inner Join COA c on a.COAID =c.COAID inner Join tblAccounts d on c.Accountid=d.accountid where a.ProdId=@ProdId and c.COACODE like  @CompanyCode+'%' 
end
   end
 


 insert into @finalData

	SELECT Id,COAstring,[Description],BeginingBal,CurrentActivity,CreatedDate, SUM(Currentactivity) OVER (PARTITION BY COAString ORDER BY Id ) AS 'AccountBal'
    FROM @Data where Createddate  between @FromDate and @ToDate  	

	Update  @finalData set BeginingBal=AccountBal-CurrentActivity ;
 

 insert into @TrialBal  

 select COAstring,'' as Description,0 as BeginginBal, sum(CurrentActivity) as Currentactivity, 0 as AccountBal from @finalData group by COAstring;


 ---------starting Cursor--------------
declare @COAStringnew varchar(100)
declare @BB decimal(18,2)
declare @AB decimal(18,2)
declare @descr varchar(100)

declare c1 cursor for 
select COAString from @TrialBal

open c1;
fetch next from c1 into @COAStringnew

while @@FETCH_STATUS = 0
begin

set @BB=( select top(1)BeginingBal  from @finalData  where COAString=@COAStringnew order by id asc)
set @AB=(select top(1)AccountBal  from @finalData  where COAString=@COAStringnew order by id desc)

set @descr=(select AccountName from tblaccounts  where Accountid in (select accountid from COA where COAcode=@COAStringnew))

update @TrialBal set beginingBal=@BB,AccountBal=@AB,[Description]=@descr  where COAString=@COAStringnew

fetch next from c1 into @COAStringnew
end
close c1;
deallocate c1;


select *  from @TrialBal

END




GO