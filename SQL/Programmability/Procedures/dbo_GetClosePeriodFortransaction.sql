SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE Procedure [dbo].[GetClosePeriodFortransaction]
@CompanyId int
As Begin



select *  from ClosePeriod  where CompanyId=@CompanyId and Status='Open'

end




GO